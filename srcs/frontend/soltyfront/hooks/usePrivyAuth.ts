import { usePrivy } from '@privy-io/react-auth';
import { useState, useCallback, useEffect } from 'react';

interface AuthTokens {
  access: string;
  refresh: string;
}

export const usePrivyAuth = () => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout, 
    getAccessToken 
  } = usePrivy();
  
  const [backendTokens, setBackendTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exchange Privy token for backend JWT tokens directly with backend
  const getBackendTokens = useCallback(async (): Promise<AuthTokens | null> => {
    if (!authenticated || !ready) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the token from Privy
      const privyToken = await getAccessToken();
      
      if (!privyToken) {
        throw new Error('Failed to get Privy token');
      }
      
      // Get the backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      // Direct backend call (no API route)
      console.log(`Authenticating with backend at: ${backendUrl}/loyalty/auth/privy-login/`);
      
      try {
        const response = await fetch(`${backendUrl}/loyalty/auth/privy-login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${privyToken}`,
          },
          body: JSON.stringify({ privy_token: privyToken }),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Authentication failed');
        }
        
        const tokens = await response.json();
        setBackendTokens(tokens);
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        
        return tokens;
      } catch (fetchError) {
        console.error('Network error during authentication:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [authenticated, ready, getAccessToken]);

  // Helper function to set user role
  const setUserRole = useCallback(async (role: 'consumer' | 'merchant'): Promise<boolean> => {
    if (!backendTokens) return false;
    
    try {
      // Get the backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      // Direct backend call (no API route)
      console.log(`Setting user role to ${role} at: ${backendUrl}/loyalty/users/set-role/`);
      
      try {
        const response = await fetch(`${backendUrl}/loyalty/users/set-role/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${backendTokens.access}`,
          },
          body: JSON.stringify({ role }),
          cache: 'no-store',
        });
        
        return response.ok;
      } catch (fetchError) {
        console.error('Network error setting role:', fetchError);
        return false;
      }
    } catch (err) {
      console.error('Error setting user role:', err);
      return false;
    }
  }, [backendTokens]);

  // Helper function to check user role
  const checkUserRole = useCallback(async (): Promise<string | null> => {
    if (!backendTokens) return null;
    
    try {
      // Get the backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      // Direct backend call (no API route)
      console.log(`Checking user role at: ${backendUrl}/loyalty/users/get-role/`);
      
      try {
        const response = await fetch(`${backendUrl}/loyalty/users/get-role/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${backendTokens.access}`,
          },
          cache: 'no-store',
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.role || null;
      } catch (fetchError) {
        console.error('Network error checking role:', fetchError);
        return null;
      }
    } catch (err) {
      console.error('Error checking user role:', err);
      return null;
    }
  }, [backendTokens]);

  // Clear tokens on logout
  const handleLogout = useCallback(async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setBackendTokens(null);
    await logout();
  }, [logout]);

  // Get stored tokens on mount or when auth state changes
  useEffect(() => {
    if (authenticated && ready) {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        setBackendTokens({ access: accessToken, refresh: refreshToken });
      } else {
        // If we're authenticated with Privy but don't have backend tokens, fetch them
        getBackendTokens();
      }
    }
  }, [authenticated, ready, getBackendTokens]);

  return {
    // Privy state
    ready,
    authenticated,
    user,
    login,
    logout: handleLogout,
    
    // Backend tokens state
    backendTokens,
    getBackendTokens,
    setUserRole,
    checkUserRole,
    loading,
    error,
    
    // Helper to get the authorization header
    getAuthHeader: () => backendTokens ? { 'Authorization': `Bearer ${backendTokens.access}` } : {},
  };
}; 
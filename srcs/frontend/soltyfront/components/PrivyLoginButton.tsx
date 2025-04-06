'use client';

import { Button } from '@/components/ui/button';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PrivyLoginButtonProps {
  redirectPath?: string;
  buttonText?: string;
  role?: 'consumer' | 'merchant';
  className?: string;
}

export function PrivyLoginButton({
  redirectPath = '/',
  buttonText = 'Continue with Privy',
  role = 'consumer',
  className = '',
}: PrivyLoginButtonProps) {
  const { login, authenticated, getBackendTokens, setUserRole, loading, error } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle authentication flow
  useEffect(() => {
    if (authenticated) {
      setIsLoading(true);
      
      // Use an async function to handle the authentication flow
      const authenticateWithBackend = async () => {
        try {
          // Step 1: Get backend tokens by exchanging Privy token
          const tokens = await getBackendTokens();
          
          if (!tokens) {
            toast.error('Failed to authenticate with backend');
            setIsLoading(false);
            return;
          }
          
          // Step 2: Set the user role directly with the backend
          const success = await setUserRole(role);
          
          if (success) {
            toast.success('Logged in successfully');
          } else {
            // Still consider it a success but with a warning
            toast.warning('Logged in with limited functionality');
            console.warn('Failed to set user role but proceeding with login');
          }
          
          // Step 3: Redirect to the specified path
          router.push(redirectPath);
        } catch (err) {
          console.error('Authentication flow error:', err);
          toast.error('Authentication failed');
        } finally {
          setIsLoading(false);
        }
      };
      
      authenticateWithBackend();
    }
  }, [authenticated, getBackendTokens, setUserRole, redirectPath, router, role]);

  // Show error if there was a problem
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogin = () => {
    setIsLoading(true);
    login().catch(() => setIsLoading(false));
  };

  return (
    <Button 
      onClick={handleLogin} 
      disabled={isLoading || loading}
      className={`w-full bg-purple-600 hover:bg-purple-700 text-white ${className}`}
    >
      {isLoading || loading ? 'Logging in...' : buttonText}
    </Button>
  );
} 
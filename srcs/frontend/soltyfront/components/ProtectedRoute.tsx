'use client';

import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from './ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: 'consumer' | 'merchant';
}

export function ProtectedRoute({
  children,
  redirectTo = '/login-customer',
  requiredRole,
}: ProtectedRouteProps) {
  const { authenticated, ready, user, backendTokens } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Don't do anything until Privy is ready
    if (!ready) return;

    const checkAuth = async () => {
      // If not authenticated, redirect to login
      if (!authenticated || !backendTokens) {
        router.push(redirectTo);
        return;
      }

      // If a specific role is required, check it
      if (requiredRole) {
        try {
          const response = await fetch('/api/auth/check-role', {
            headers: {
              'Authorization': `Bearer ${backendTokens.access}`,
            },
          });

          if (!response.ok) {
            router.push(redirectTo);
            return;
          }

          const { role } = await response.json();
          
          if (role !== requiredRole) {
            const properRedirect = requiredRole === 'merchant' 
              ? '/login-business' 
              : '/login-customer';
            router.push(properRedirect);
            return;
          }
        } catch (error) {
          console.error('Error checking role:', error);
          router.push(redirectTo);
          return;
        }
      }

      // If we made it here, user has access
      setHasAccess(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [authenticated, ready, backendTokens, requiredRole, redirectTo, router, user]);

  if (isLoading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
} 
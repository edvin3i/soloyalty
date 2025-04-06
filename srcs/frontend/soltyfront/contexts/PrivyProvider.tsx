'use client';

import { PrivyProvider as PrivyClientProvider } from '@privy-io/react-auth';
import { PropsWithChildren, useState, useEffect } from 'react';

export default function PrivyProvider({ children }: PropsWithChildren) {
  // Handle loading state while checking for environment variables
  const [isLoading, setIsLoading] = useState(true);
  const [appId, setAppId] = useState<string | null>(null);

  useEffect(() => {
    // Get the Privy app ID from environment variables
    const envAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    setAppId(envAppId || null);
    
    if (!envAppId) {
      console.error('Privy App ID not found. Please ensure NEXT_PUBLIC_PRIVY_APP_ID is set in your root .env file.');
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!appId) {
    console.error('Privy App ID not found. Please set NEXT_PUBLIC_PRIVY_APP_ID in your root .env file.');
    return <div>Authentication configuration error. Please contact support.</div>;
  }

  return (
    <PrivyClientProvider
      appId={appId}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#7c3aed', // Purple to match app theme
          logo: '/logo.png', // Adjust this to your logo path
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyClientProvider>
  );
} 
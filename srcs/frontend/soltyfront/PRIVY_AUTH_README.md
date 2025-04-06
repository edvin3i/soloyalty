# Privy Authentication Integration

This document outlines how to set up and use the Privy authentication in the Soloyalty application.

## Setup Instructions

1. First, create an account on [Privy](https://privy.io) and create a new application.

2. Copy your Privy App ID from the Privy dashboard.

3. Ensure these environment variables are set in the root `.env` file of the project:

```
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

If your backend is running on a different URL, update the `NEXT_PUBLIC_BACKEND_URL` accordingly.

4. Ensure the backend has the required API key set up in the same `.env` file:

```
OA_SECRET=your-privy-api-key
```

## Docker Setup

When running in Docker, the application will:

1. Look for the `.env` file in several locations (root directory, Docker container root, frontend directory)
2. If no `.env` file is found, it will use the default values or environment variables passed to the container
3. A fallback `.env` file is provided in the frontend directory with default values

You can override these defaults by setting environment variables in your Docker Compose file or when running the container:

```yaml
environment:
  - NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
  - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
```

## Usage

The app now supports two login methods:

1. **Privy Authentication**: A modern, secure authentication method that supports both email and wallet-based login.
2. **Email/Password Authentication**: The traditional method using email and password.

### Protected Routes

For routes that require authentication, wrap your page component with the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      {/* Your protected content here */}
    </ProtectedRoute>
  );
}
```

For routes that require a specific role:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MerchantOnlyPage() {
  return (
    <ProtectedRoute requiredRole="merchant" redirectTo="/login-business">
      {/* Merchant-only content here */}
    </ProtectedRoute>
  );
}
```

### Using the Auth Hook

The `usePrivyAuth` hook provides access to authentication state and methods:

```tsx
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

function MyComponent() {
  const { 
    authenticated, 
    user, 
    login, 
    logout, 
    getAuthHeader, 
    backendTokens 
  } = usePrivyAuth();

  // Check if user is authenticated
  if (!authenticated) {
    return <button onClick={login}>Login</button>;
  }

  // Make an authenticated API request
  const fetchData = async () => {
    const response = await fetch('/api/protected-endpoint', {
      headers: {
        ...getAuthHeader(), // Adds the Authorization header
      },
    });
    // Process response...
  };

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

## Backend Integration

The Privy authentication flow works as follows:

1. User authenticates with Privy on the frontend
2. Frontend gets a Privy token
3. Frontend exchanges this token with the backend for JWT tokens
4. Backend validates the Privy token with Privy API
5. Backend returns access and refresh JWT tokens to the frontend
6. Frontend uses these tokens for subsequent API calls

The backend already has the necessary endpoint at `/loyalty/auth/privy-login/` to handle this flow.

## Environment Variables

All required environment variables are now centralized in the root `.env` file. This ensures that both frontend and backend have access to the same configuration values.

For Docker environments, the build system will look for environment variables in multiple locations and provide sensible defaults if none are found. 
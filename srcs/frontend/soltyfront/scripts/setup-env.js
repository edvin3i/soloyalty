#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Potential paths to the .env file
const possiblePaths = [
  // Root .env (3 levels up from this directory)
  path.resolve(__dirname, '../../../../.env'),
  // Root .env (from Docker root)
  '/.env',
  // Local to the frontend project
  path.resolve(__dirname, '../.env'),
  // Current working directory
  path.resolve(process.cwd(), '.env')
];

// Find the first existing .env file
let rootEnvPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    rootEnvPath = testPath;
    console.log(`✅ Found .env file at: ${rootEnvPath}`);
    break;
  }
}

const frontendEnvPath = path.resolve(__dirname, '../.env.local');

// Create a default .env.local if no root .env is found (for Docker builds)
if (!rootEnvPath) {
  console.warn('⚠️ No .env file found in any of the expected locations.');
  console.warn('Creating a default .env.local file for Docker builds...');
  
  // Create a basic .env.local with required variables
  // Use environment variables if available, or fallback to defaults
  const defaultEnvContent = `
# Default Privy configuration for Docker builds
NEXT_PUBLIC_PRIVY_APP_ID="${process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm94qbsau0099l10kurg6yet2'}"
NEXT_PUBLIC_BACKEND_URL="${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}"
`;
  
  fs.writeFileSync(frontendEnvPath, defaultEnvContent.trim());
  console.log('✅ Created default .env.local for Docker build');
  process.exit(0);
}

// Read the root .env file
const rootEnvContent = fs.readFileSync(rootEnvPath, 'utf8');

// Filter only the NEXT_PUBLIC_ variables
const nextPublicVars = rootEnvContent.split('\n')
  .filter(line => line.trim() && line.trim().startsWith('NEXT_PUBLIC_'))
  .join('\n');

// Create the frontend environment file
if (nextPublicVars.trim()) {
  fs.writeFileSync(frontendEnvPath, nextPublicVars);
  console.log('✅ Created .env.local with NEXT_PUBLIC_ variables from root .env');
} else {
  console.warn('⚠️ No NEXT_PUBLIC_ variables found in root .env');
  console.warn('Creating a default .env.local file...');
  
  // Create a basic .env.local with required variables
  const defaultEnvContent = `
# Default Privy configuration
NEXT_PUBLIC_PRIVY_APP_ID="${process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm94qbsau0099l10kurg6yet2'}"
NEXT_PUBLIC_BACKEND_URL="${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}"
`;
  
  fs.writeFileSync(frontendEnvPath, defaultEnvContent.trim());
  console.log('✅ Created default .env.local');
}

// Verify if Privy environment variables exist in the created file
const createdEnvContent = fs.readFileSync(frontendEnvPath, 'utf8');

if (!createdEnvContent.includes('NEXT_PUBLIC_PRIVY_APP_ID')) {
  console.warn('⚠️ Missing NEXT_PUBLIC_PRIVY_APP_ID in the created .env.local');
  console.warn('Privy authentication will not work without this variable.');
}

console.log('🔄 Environment setup complete. You can now run the frontend app.');
console.log('ℹ️ For development purposes, environment variables have been prepared in .env.local');
console.log('ℹ️ In production, environment variables are typically provided through the hosting platform.'); 
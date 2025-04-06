import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name of the current file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Potential paths to the .env file
const possiblePaths = [
  // Root .env (3 levels up from this file)
  path.resolve(__dirname, '../../../.env'),
  // Root .env (from Docker root)
  '/.env',
  // Local to the frontend project
  path.resolve(__dirname, '.env'),
  // Current working directory
  path.resolve(process.cwd(), '.env')
];

// Function to load .env file
function loadEnv(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      const envData = fs.readFileSync(filePath, 'utf8');
      const envVars = envData.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .reduce((acc, line) => {
          const [key, ...values] = line.split('=');
          if (key && values.length) {
            acc[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
          }
          return acc;
        }, {});
      
      // Add env vars that start with NEXT_PUBLIC_ to process.env
      Object.entries(envVars).forEach(([key, value]) => {
        if (key.startsWith('NEXT_PUBLIC_')) {
          process.env[key] = process.env[key] || value; // Don't override existing env vars
        }
      });
      
      return envVars;
    } catch (err) {
      console.warn(`Warning: Error reading .env file at ${filePath}`, err);
      return {};
    }
  }
  return {};
}

// Try to load .env from any of the possible paths
let envVars = {};
for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Loading environment variables from: ${envPath}`);
    envVars = loadEnv(envPath);
    break;
  }
}

// Default environment variables for Docker if none were found
if (Object.keys(envVars).filter(key => key.startsWith('NEXT_PUBLIC_')).length === 0) {
  console.log('No NEXT_PUBLIC_ variables found in .env files. Using defaults or existing environment variables.');
  
  // Set default values if environment variables aren't already set
  process.env.NEXT_PUBLIC_PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm94qbsau0099l10kurg6yet2';
  process.env.NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  
  // Add these defaults to our envVars object
  envVars.NEXT_PUBLIC_PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  envVars.NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pass NEXT_PUBLIC_ variables to the client
  env: Object.entries(envVars)
    .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {}),
    
  // Moved out of experimental as per Next.js recommendation
  outputFileTracingRoot: path.join(__dirname, '../../..'),
  
  // Enable static export for compatibility with nginx
  output: 'export', 
  
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig; 
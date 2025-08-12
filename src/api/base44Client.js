import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "685d0346ef78b5bb035bc924", 
  requiresAuth: true // Ensure authentication is required for all operations
});

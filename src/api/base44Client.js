import { createClient } from "@base44/sdk";

export const base44 = createClient({
  appId: "685d0346ef78b5bb035bc924",
  requiresAuth: process.env.NODE_ENV !== "development", // only requires auth in prod
});

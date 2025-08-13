// base44Client.js
import { createClient } from "@base44/sdk";

const isDev = process.env.NODE_ENV === "development";

export const base44 = createClient({
  appId: "685d0346ef78b5bb035bc924",
  requiresAuth: !isDev,
});

if (isDev) {
  console.warn(
    "Running Base44 in DEV mode — using mock entities/functions/integrations"
  );

  // Ensure namespaces exist
  base44.entities = base44.entities || {};
  base44.functions = base44.functions || {};
  base44.integrations = base44.integrations || {};
  base44.auth = base44.auth || {};

  // ---------- ENTITIES ----------
  const mockEntity = (name) => ({
    find: async () => {
      console.log(`Mock ${name}.find() called`);
      return [];
    },
    create: async (data) => {
      console.log(`Mock ${name}.create() called with`, data);
      return { id: "mock-id", ...data };
    },
    update: async (id, data) => {
      console.log(`Mock ${name}.update(${id}) called with`, data);
      return { id, ...data };
    },
  });

  [
    "Visit",
    "SalesOrder",
    "SKUInventory",
    "Client",
    "Liquidation",
    "Task",
    "GameStats",
    "MonthlyPlan",
    "Territory",
    "GeofenceAlert",
    "CredibilityScore",
    "Overhead",
    "DealerSalesData",
    "AnnualTarget",
    "AttendanceRecord",
    "RouteTracking",
    "AuditTrail",
    "ActivityCategory",
    "LocationAlert",
  ].forEach((entity) => {
    base44.entities[entity] = mockEntity(entity);
  });

  // ---------- FUNCTIONS ----------
  base44.functions.exportTeamReport = async () => {
    console.log("Mocked exportTeamReport()");
    return { report: "Fake data in dev mode" };
  };

  // ---------- INTEGRATIONS ----------
  base44.integrations.Core = {
    InvokeLLM: async (prompt) => {
      console.log("Mock InvokeLLM called with", prompt);
      return "Mock LLM response";
    },
    SendEmail: async (details) => {
      console.log("Mock SendEmail called with", details);
      return "Mock email sent";
    },
    UploadFile: async (file) => {
      console.log("Mock UploadFile called with", file);
      return { fileId: "mock-file-id" };
    },
    GenerateImage: async (params) => {
      console.log("Mock GenerateImage called with", params);
      return { imageUrl: "https://placehold.co/600x400" };
    },
    ExtractDataFromUploadedFile: async (file) => {
      console.log("Mock ExtractDataFromUploadedFile called with", file);
      return { extracted: "Mock file data" };
    },
  };

  // ---------- AUTH ----------
  base44.auth = {
    login: async () => console.log("Mock login"),
    logout: async () => console.log("Mock logout"),
    currentUser: { id: "mock-user", name: "Dev User" },
  };
}

// functions.js
import { base44 } from "./base44Client";

export const exportTeamReport =
  process.env.NODE_ENV === "development"
    ? async () => {
        console.log("Dev mode: returning fake report");
        return { report: "This is a mock report" };
      }
    : base44.functions.exportTeamReport;

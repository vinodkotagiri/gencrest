// entities.js
import { base44 } from "./base44Client";

// ===== Entities =====
export const Visit = base44.entities?.Visit;
export const SalesOrder = base44.entities?.SalesOrder;
export const SKUInventory = base44.entities?.SKUInventory;
export const Client = base44.entities?.Client;
export const Liquidation = base44.entities?.Liquidation;
export const Task = base44.entities?.Task;
export const GameStats = base44.entities?.GameStats;
export const MonthlyPlan = base44.entities?.MonthlyPlan;
export const Territory = base44.entities?.Territory;
export const GeofenceAlert = base44.entities?.GeofenceAlert;
export const CredibilityScore = base44.entities?.CredibilityScore;
export const Overhead = base44.entities?.Overhead;
export const DealerSalesData = base44.entities?.DealerSalesData;
export const AnnualTarget = base44.entities?.AnnualTarget;
export const AttendanceRecord = base44.entities?.AttendanceRecord;
export const RouteTracking = base44.entities?.RouteTracking;
export const AuditTrail = base44.entities?.AuditTrail;
export const ActivityCategory = base44.entities?.ActivityCategory;
export const LocationAlert = base44.entities?.LocationAlert;

// ===== Auth =====
export const Auth = base44.auth || {};
export const User = base44.auth?.currentUser || null;

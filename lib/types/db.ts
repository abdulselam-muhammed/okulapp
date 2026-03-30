import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type { RowDataPacket, ResultSetHeader };

// Base row type for all database entities
export interface BaseRow extends RowDataPacket {
  id: number;
  created_at: Date;
}

// User roles matching the DB enum
export type UserRole = "admin" | "advisor" | "volunteer" | "vet" | "user";

// Report types
export type ReportType = "injured_animal" | "feeding_point";

// Priority levels
export type Priority = "low" | "medium" | "high" | "urgent";

// Report status
export type ReportStatus =
  | "pending"
  | "approved"
  | "assigned"
  | "in_progress"
  | "completed"
  | "rejected"
  | "needs_correction";

// Task status
export type TaskStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancelled";

// Task type
export type TaskType = "rescue" | "feeding" | "vet_transport" | "other";

// Animal condition
export type AnimalCondition = "minor" | "moderate" | "severe" | "critical";

// Animal status
export type AnimalStatus =
  | "reported"
  | "in_rescue"
  | "at_vet"
  | "treated"
  | "released"
  | "deceased";

// Feeding point status
export type FeedingPointStatus = "active" | "needs_refill" | "inactive";

// Vet workload
export type VetWorkload = "light" | "moderate" | "heavy";

// Vet case outcome
export type VetCaseOutcome = "ongoing" | "recovered" | "released" | "deceased";

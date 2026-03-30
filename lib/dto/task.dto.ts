import { z } from "zod";

export const createTaskDto = z.object({
  report_id: z.number().int().positive().optional(),
  assigned_to: z.number().int().positive(),
  type: z.enum(["rescue", "feeding", "vet_transport", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  notes: z.string().optional(),
  deadline: z.string().datetime().optional(),
});

export const updateTaskStatusDto = z.object({
  status: z.enum([
    "pending",
    "accepted",
    "rejected",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  rejection_reason: z.string().optional(),
});

export const addTaskEvidenceDto = z.object({
  photo_url: z.string().url(),
  description: z.string().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskDto>;
export type UpdateTaskStatusDto = z.infer<typeof updateTaskStatusDto>;
export type AddTaskEvidenceDto = z.infer<typeof addTaskEvidenceDto>;

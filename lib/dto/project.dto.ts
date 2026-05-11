import { z } from "zod";

export const PROJECT_STATUSES = ["upcoming", "active", "completed", "cancelled"] as const;

export const createProjectDto = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  cover_image_url: z.string().url().optional(),
  start_date: z.string().optional(), // ISO date string
  end_date: z.string().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  donation_goal: z.number().positive().optional(),
  donation_raised: z.number().min(0).optional(),
  image_urls: z.array(z.string().url()).optional(),
});

export const updateProjectDto = createProjectDto.partial();

export type CreateProjectDto = z.infer<typeof createProjectDto>;
export type UpdateProjectDto = z.infer<typeof updateProjectDto>;

import { z } from "zod";

export const createArticleDto = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  cover_image_url: z.string().url().optional(),
  project_id: z.number().int().positive().optional(),
  published_at: z.string().optional(), // ISO datetime
});

export const updateArticleDto = createArticleDto.partial();

export type CreateArticleDto = z.infer<typeof createArticleDto>;
export type UpdateArticleDto = z.infer<typeof updateArticleDto>;

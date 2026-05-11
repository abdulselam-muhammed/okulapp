import { articleRepository } from "@/lib/repositories/article.repository";
import { activityLog } from "@/lib/services/activity-log.service";
import { ApiError } from "@/lib/helpers/api-error";
import type { CreateArticleDto, UpdateArticleDto } from "@/lib/dto/article.dto";

function toDate(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export const articleService = {
  async getAll(limit?: number, offset?: number) {
    return articleRepository.findAllWithDetails(limit, offset);
  },

  async getById(id: number) {
    const article = await articleRepository.findByIdWithDetails(id);
    if (!article) throw ApiError.notFound("Article not found");
    return article;
  },

  async getByProject(projectId: number) {
    return articleRepository.findByProject(projectId);
  },

  async create(actorId: number | null, dto: CreateArticleDto) {
    const id = await articleRepository.create({
      title: dto.title,
      content: dto.content,
      cover_image_url: dto.cover_image_url ?? null,
      project_id: dto.project_id ?? null,
      author_id: actorId,
      published_at: toDate(dto.published_at) ?? new Date(),
    });

    await activityLog.log(
      actorId,
      "create",
      "article",
      id,
      `Published article "${dto.title}"${dto.project_id ? ` for project #${dto.project_id}` : ""}`,
      { project_id: dto.project_id }
    );

    return articleService.getById(id);
  },

  async update(id: number, actorId: number | null, dto: UpdateArticleDto) {
    await articleService.getById(id); // ensure exists

    const updateData: Record<string, unknown> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.cover_image_url !== undefined) updateData.cover_image_url = dto.cover_image_url;
    if (dto.project_id !== undefined) updateData.project_id = dto.project_id;
    if (dto.published_at !== undefined) updateData.published_at = toDate(dto.published_at);

    if (Object.keys(updateData).length > 0) {
      await articleRepository.update(id, updateData);
    }

    await activityLog.log(
      actorId,
      "update",
      "article",
      id,
      `Updated article #${id}: ${Object.keys(updateData).join(", ")}`,
      { fields: Object.keys(updateData) }
    );

    return articleService.getById(id);
  },

  async delete(id: number, actorId: number | null) {
    const existing = await articleRepository.findById(id);
    const deleted = await articleRepository.delete(id);
    if (!deleted) throw ApiError.notFound("Article not found");

    await activityLog.log(
      actorId,
      "delete",
      "article",
      id,
      existing ? `Deleted article "${existing.title}"` : `Deleted article #${id}`
    );
  },
};

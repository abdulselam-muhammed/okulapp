import { projectRepository } from "@/lib/repositories/project.repository";
import { activityLog } from "@/lib/services/activity-log.service";
import { ApiError } from "@/lib/helpers/api-error";
import type { CreateProjectDto, UpdateProjectDto } from "@/lib/dto/project.dto";

function toDate(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export const projectService = {
  async getAll(limit?: number, offset?: number) {
    return projectRepository.findAllWithCounts(limit, offset);
  },

  async getById(id: number) {
    const project = await projectRepository.findById(id);
    if (!project) throw ApiError.notFound("Project not found");
    const images = await projectRepository.findImages(id);
    return { ...project, images };
  },

  async create(actorId: number | null, dto: CreateProjectDto) {
    const id = await projectRepository.create({
      title: dto.title,
      description: dto.description,
      cover_image_url: dto.cover_image_url ?? null,
      start_date: toDate(dto.start_date),
      end_date: toDate(dto.end_date),
      status: dto.status ?? "active",
      donation_goal: dto.donation_goal ?? null,
      donation_raised: dto.donation_raised ?? 0,
      created_by: actorId,
    });

    // Save gallery images
    if (dto.image_urls && dto.image_urls.length > 0) {
      for (let i = 0; i < dto.image_urls.length; i++) {
        await projectRepository.addImage(id, dto.image_urls[i], undefined, i);
      }
    }

    await activityLog.log(
      actorId,
      "create",
      "project",
      id,
      `Created project "${dto.title}"`,
      { status: dto.status ?? "active", goal: dto.donation_goal }
    );

    return projectService.getById(id);
  },

  async update(id: number, actorId: number | null, dto: UpdateProjectDto) {
    await projectService.getById(id); // ensure exists

    const updateData: Record<string, unknown> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.cover_image_url !== undefined) updateData.cover_image_url = dto.cover_image_url;
    if (dto.start_date !== undefined) updateData.start_date = toDate(dto.start_date);
    if (dto.end_date !== undefined) updateData.end_date = toDate(dto.end_date);
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.donation_goal !== undefined) updateData.donation_goal = dto.donation_goal;
    if (dto.donation_raised !== undefined) updateData.donation_raised = dto.donation_raised;

    if (Object.keys(updateData).length > 0) {
      await projectRepository.update(id, updateData);
    }

    // If image_urls is provided, replace the gallery
    if (dto.image_urls !== undefined) {
      await projectRepository.removeAllImages(id);
      for (let i = 0; i < dto.image_urls.length; i++) {
        await projectRepository.addImage(id, dto.image_urls[i], undefined, i);
      }
    }

    await activityLog.log(
      actorId,
      "update",
      "project",
      id,
      `Updated project #${id}: ${Object.keys(updateData).join(", ") || "images only"}`,
      { fields: Object.keys(updateData) }
    );

    return projectService.getById(id);
  },

  async delete(id: number, actorId: number | null) {
    const existing = await projectRepository.findById(id);
    const deleted = await projectRepository.delete(id);
    if (!deleted) throw ApiError.notFound("Project not found");

    await activityLog.log(
      actorId,
      "delete",
      "project",
      id,
      existing ? `Deleted project "${existing.title}"` : `Deleted project #${id}`
    );
  },
};

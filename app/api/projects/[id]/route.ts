import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { projectService } from "@/lib/services/project.service";
import { updateProjectDto } from "@/lib/dto/project.dto";

export const GET = handler(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const project = await projectService.getById(Number(id));
  return res.success(project);
});

export const PUT = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = requireRole(req, "admin");
  const { id } = await ctx.params;
  const dto = await validate(req, updateProjectDto);
  const project = await projectService.update(Number(id), auth.userId, dto);
  return res.success(project);
});

export const DELETE = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = requireRole(req, "admin");
  const { id } = await ctx.params;
  await projectService.delete(Number(id), auth.userId);
  return res.noContent();
});

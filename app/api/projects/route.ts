import { handler, validate, pagination } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { projectService } from "@/lib/services/project.service";
import { createProjectDto } from "@/lib/dto/project.dto";

export const GET = handler(async (req) => {
  const { limit, offset } = pagination(req);
  const data = await projectService.getAll(limit, offset);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const auth = requireRole(req, "admin");
  const dto = await validate(req, createProjectDto);
  const project = await projectService.create(auth.userId, dto);
  return res.created(project);
});

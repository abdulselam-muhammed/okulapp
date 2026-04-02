import { handler, validate, pagination } from "@/lib/helpers/controller";
import { getAuth, requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { taskService } from "@/lib/services/task.service";
import { createTaskDto } from "@/lib/dto/task.dto";

export const GET = handler(async (req) => {
  const auth = getAuth(req);
  const { limit, offset } = pagination(req);

  // Volunteers see only their own tasks
  if (auth.role === "volunteer") {
    const data = await taskService.getByVolunteer(auth.userId);
    return res.success(data);
  }

  requireRole(req, "admin", "advisor");
  const data = await taskService.getAll(limit, offset);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const auth = requireRole(req, "admin", "advisor");
  const dto = await validate(req, createTaskDto);
  const task = await taskService.create(auth.userId, dto);
  return res.created(task);
});

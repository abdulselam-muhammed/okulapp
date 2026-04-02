import { handler, validate } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { taskService } from "@/lib/services/task.service";
import { updateTaskStatusDto } from "@/lib/dto/task.dto";

export const PATCH = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = getAuth(req);
  const { id } = await ctx.params;
  const dto = await validate(req, updateTaskStatusDto);
  const task = await taskService.updateStatus(Number(id), auth.userId, dto);
  return res.success(task);
});

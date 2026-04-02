import { handler } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { taskService } from "@/lib/services/task.service";

export const GET = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  getAuth(req);
  const { id } = await ctx.params;
  const task = await taskService.getById(Number(id));
  return res.success(task);
});

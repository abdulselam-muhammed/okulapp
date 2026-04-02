import { handler } from "@/lib/helpers/controller";
import { getAuth, requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { taskService } from "@/lib/services/task.service";

export const GET = handler(async (req, ctx: { params: Promise<{ volunteerId: string }> }) => {
  const auth = getAuth(req);
  const { volunteerId } = await ctx.params;
  const vid = Number(volunteerId);

  // Volunteers can only see their own tasks, admin/advisor can see anyone's
  if (auth.role === "volunteer" && auth.userId !== vid) {
    requireRole(req, "admin", "advisor");
  }

  const data = await taskService.getByVolunteer(vid);
  return res.success(data);
});

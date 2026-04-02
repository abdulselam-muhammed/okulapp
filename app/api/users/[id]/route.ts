import { handler, validate } from "@/lib/helpers/controller";
import { getAuth, requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { userService } from "@/lib/services/user.service";
import { updateUserDto } from "@/lib/dto/user.dto";

export const GET = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = getAuth(req);
  const { id } = await ctx.params;
  const userId = Number(id);

  // Users can view their own profile, admin/advisor can view anyone
  if (auth.userId !== userId) {
    requireRole(req, "admin", "advisor");
  }

  const user = await userService.getById(userId);
  return res.success(user);
});

export const PUT = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = getAuth(req);
  const { id } = await ctx.params;
  const userId = Number(id);

  // Users can update their own profile, admin can update anyone
  if (auth.userId !== userId) {
    requireRole(req, "admin");
  }

  const dto = await validate(req, updateUserDto);
  const user = await userService.update(userId, dto);
  return res.success(user);
});

export const DELETE = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  requireRole(req, "admin");
  const { id } = await ctx.params;
  const userId = Number(id);

  await userService.delete(userId);
  return res.noContent();
});

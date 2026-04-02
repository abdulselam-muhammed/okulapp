import { handler, validate } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import { ApiError } from "@/lib/helpers/api-error";
import * as res from "@/lib/helpers/api-response";
import { userService } from "@/lib/services/user.service";
import { updateLocationDto } from "@/lib/dto/user.dto";

export const PUT = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = getAuth(req);
  const { id } = await ctx.params;
  const userId = Number(id);

  if (auth.userId !== userId) {
    throw ApiError.forbidden("You can only update your own location");
  }

  const dto = await validate(req, updateLocationDto);
  await userService.updateLocation(userId, dto.latitude, dto.longitude);
  return res.success({ message: "Location updated" });
});

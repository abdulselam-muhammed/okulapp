import { handler, validate } from "@/lib/helpers/controller";
import * as res from "@/lib/helpers/api-response";
import { authService } from "@/lib/services/auth.service";
import { registerDto } from "@/lib/dto/auth.dto";

export const POST = handler(async (req) => {
  const dto = await validate(req, registerDto);
  const result = await authService.register(dto);
  return res.created(result);
});

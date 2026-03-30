import { handler, validate } from "@/lib/helpers/controller";
import * as res from "@/lib/helpers/api-response";
import { authService } from "@/lib/services/auth.service";
import { loginDto } from "@/lib/dto/auth.dto";

export const POST = handler(async (req) => {
  const dto = await validate(req, loginDto);
  const result = await authService.login(dto);
  return res.success(result);
});

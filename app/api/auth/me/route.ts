import { handler } from "@/lib/helpers/controller";
import * as res from "@/lib/helpers/api-response";
import { authService } from "@/lib/services/auth.service";
import { getAuth } from "@/lib/helpers/auth";

export const GET = handler(async (req) => {
  const auth = getAuth(req);
  const user = await authService.me(auth);
  return res.success(user);
});

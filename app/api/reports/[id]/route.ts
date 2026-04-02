import { handler } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { reportService } from "@/lib/services/report.service";

export const GET = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  getAuth(req);
  const { id } = await ctx.params;
  const report = await reportService.getById(Number(id));
  return res.success(report);
});

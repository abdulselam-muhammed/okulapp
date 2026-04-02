import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { reportService } from "@/lib/services/report.service";
import { updateReportStatusDto } from "@/lib/dto/report.dto";

export const PATCH = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  requireRole(req, "admin", "advisor");
  const { id } = await ctx.params;
  const dto = await validate(req, updateReportStatusDto);
  const report = await reportService.updateStatus(Number(id), dto);
  return res.success(report);
});

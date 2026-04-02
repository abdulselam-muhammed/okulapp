import { handler, validate, pagination, param } from "@/lib/helpers/controller";
import { getAuth, requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { reportService } from "@/lib/services/report.service";
import { createReportDto } from "@/lib/dto/report.dto";

export const GET = handler(async (req) => {
  const auth = getAuth(req);
  const { limit, offset } = pagination(req);

  // Regular users can only see their own reports
  if (auth.role === "user") {
    const data = await reportService.getByReporter(auth.userId);
    return res.success(data);
  }

  const data = await reportService.getAll(limit, offset);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const auth = getAuth(req);
  const dto = await validate(req, createReportDto);
  const report = await reportService.create(auth.userId, dto);
  return res.created(report);
});

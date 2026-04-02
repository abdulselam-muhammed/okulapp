import { handler, validate } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { taskService } from "@/lib/services/task.service";
import { addTaskEvidenceDto } from "@/lib/dto/task.dto";

export const POST = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = getAuth(req);
  const { id } = await ctx.params;
  const dto = await validate(req, addTaskEvidenceDto);
  await taskService.addEvidence(Number(id), auth.userId, dto.photo_url, dto.description);
  return res.created({ message: "Evidence uploaded" });
});

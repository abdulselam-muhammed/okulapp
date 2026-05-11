import { handler, validate, pagination, param } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { articleService } from "@/lib/services/article.service";
import { createArticleDto } from "@/lib/dto/article.dto";

export const GET = handler(async (req) => {
  const { limit, offset } = pagination(req);
  const projectId = param(req, "project_id");

  if (projectId) {
    const data = await articleService.getByProject(Number(projectId));
    return res.success(data);
  }

  const data = await articleService.getAll(limit, offset);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const auth = requireRole(req, "admin");
  const dto = await validate(req, createArticleDto);
  const article = await articleService.create(auth.userId, dto);
  return res.created(article);
});

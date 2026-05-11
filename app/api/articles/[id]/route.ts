import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { articleService } from "@/lib/services/article.service";
import { updateArticleDto } from "@/lib/dto/article.dto";

export const GET = handler(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const article = await articleService.getById(Number(id));
  return res.success(article);
});

export const PUT = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = requireRole(req, "admin");
  const { id } = await ctx.params;
  const dto = await validate(req, updateArticleDto);
  const article = await articleService.update(Number(id), auth.userId, dto);
  return res.success(article);
});

export const DELETE = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = requireRole(req, "admin");
  const { id } = await ctx.params;
  await articleService.delete(Number(id), auth.userId);
  return res.noContent();
});

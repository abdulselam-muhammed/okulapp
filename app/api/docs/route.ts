import { openApiSpec } from "@/lib/swagger/openapi";

export async function GET() {
  return Response.json(openApiSpec);
}

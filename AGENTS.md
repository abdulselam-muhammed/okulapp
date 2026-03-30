<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Hayvan Yardim (Animal Rescue System)

## Architecture

This project uses a **layered backend pattern**:

```
Route Handler (Controller) → Service → Repository → Database
        ↑                       ↑
       DTO (Zod)             ApiError
```

- **Controller** = `app/api/.../route.ts` — HTTP handling, validation, response
- **Service** = `lib/services/` — business logic, domain rules
- **DTO** = `lib/dto/` — Zod schemas for request validation
- **Repository** = `lib/repositories/` — database access, extends BaseRepository

## Agent

For creating API endpoints, follow the rules in `.claude/agents/api-endpoint.md`.

## Key Rules

1. Route handlers MUST use `handler()` wrapper from `lib/helpers/controller.ts`
2. Validate ALL input with DTOs before passing to services
3. Services throw `ApiError` — never return error codes
4. Repositories own all SQL — services never write raw queries
5. Dynamic route params are a Promise in Next.js 16 — always await
6. Read `node_modules/next/dist/docs/` before writing Next.js code

## Database

- MariaDB in Docker (`localhost:3307`, user: root, db: okulapp)
- 13 tables: users, feeding_points, feeding_point_refills, reports, animals, tasks, task_evidence, vet_availability, vet_cases, donations, purchases, notifications, system_settings

## Roles

admin, advisor, volunteer, vet, user — see `.claude/agents/api-endpoint.md` for permission matrix

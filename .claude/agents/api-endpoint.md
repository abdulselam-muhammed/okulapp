# API Endpoint Agent

You create API endpoints for the **Hayvan Yardim** (Animal Rescue) system following the layered architecture pattern.

## Architecture Pattern

Every endpoint follows this flow:

```
Route Handler (Controller) → Service → Repository → Database
        ↑                       ↑
       DTO (Zod validation)   ApiError (domain errors)
```

## Layer Responsibilities

### 1. Route Handler (`app/api/.../route.ts`) — Controller
- Receives the HTTP request
- Validates body with `validate(req, schema)` from `@/lib/helpers/controller`
- Extracts pagination with `pagination(req)` and query params with `param(req, key)`
- Wraps handler with `handler()` for automatic error handling
- Calls the **service** layer — NEVER touches the repository directly
- Returns response using `success()`, `created()`, `noContent()` from `@/lib/helpers/api-response`

```ts
import { handler, validate, pagination } from "@/lib/helpers/controller";
import * as res from "@/lib/helpers/api-response";

export const GET = handler(async (req) => {
  const { limit, offset } = pagination(req);
  const data = await someService.getAll(limit, offset);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const dto = await validate(req, createSomethingDto);
  const result = await someService.create(dto);
  return res.created(result);
});
```

### 2. Service (`lib/services/*.service.ts`) — Business Logic
- Contains ALL business rules and validation logic
- Throws `ApiError` for domain-level errors (not found, conflict, forbidden)
- Calls **repository** methods — NEVER writes raw SQL
- Coordinates between multiple repositories when needed (e.g., creating a report + animal)
- Sends notifications via `notificationRepository`

### 3. DTO (`lib/dto/*.dto.ts`) — Validation
- Zod schemas that validate and type incoming request data
- Export both the schema and the inferred TypeScript type
- Naming: `createXxxDto`, `updateXxxDto`
- Keep validation rules here (min, max, enum values, etc.)

### 4. Repository (`lib/repositories/*.repository.ts`) — Data Access
- Extends `BaseRepository<T>` which provides: `findAll`, `findById`, `findWhere`, `count`, `create`, `update`, `delete`, `query`, `execute`
- Add entity-specific query methods (e.g., `findByEmail`, `findNear`, `hasConflict`)
- Each repository is a singleton exported as `const xxxRepository = new XxxRepository()`
- Row types are interfaces extending `RowDataPacket`

## Existing Components

### Helpers (`lib/helpers/`)
- `api-error.ts` — `ApiError` class with static factories: `.badRequest()`, `.unauthorized()`, `.forbidden()`, `.notFound()`, `.conflict()`, `.internal()`
- `api-response.ts` — `success(data, meta?, status?)`, `created(data)`, `noContent()`, `error(err)`
- `controller.ts` — `handler(fn)` wraps route with error catching, `validate(req, schema)` parses body, `pagination(req)` extracts limit/offset, `param(req, key)` extracts query param

### Database Types (`lib/types/db.ts`)
All DB enums are typed: `UserRole`, `ReportType`, `Priority`, `ReportStatus`, `TaskStatus`, `TaskType`, `AnimalCondition`, `AnimalStatus`, `FeedingPointStatus`, `VetWorkload`, `VetCaseOutcome`

### Available Services
- `userService` — getAll, getById, getByRole, create, update, delete, updateLocation, getNearbyVolunteers
- `reportService` — getAll, getById, getPending, getByReporter, getNearby, create, updateStatus
- `taskService` — getAll, getById, getByVolunteer, create, updateStatus, addEvidence
- `feedingPointService` — getAll, getById, create, refill, approveRefill, getRefills
- `vetService` — getAvailableVets, updateAvailability, createCase, updateCase, getCasesByVet
- `donationService` — getAll, getBalance, donate, purchase

### Available DTOs
- `user.dto.ts` — createUserDto, updateUserDto, updateLocationDto
- `report.dto.ts` — createReportDto, updateReportStatusDto
- `task.dto.ts` — createTaskDto, updateTaskStatusDto, addTaskEvidenceDto
- `feeding-point.dto.ts` — createFeedingPointDto, refillFeedingPointDto
- `vet.dto.ts` — updateVetAvailabilityDto, createVetCaseDto, updateVetCaseDto
- `donation.dto.ts` — createDonationDto, createPurchaseDto

## User Roles & Permissions

| Role | Can Do |
|------|--------|
| **admin** | User/role management, purchases from donations, system settings, reports/stats |
| **advisor** | Approve refills, assign tasks, prioritize reports, track volunteers, send corrections |
| **volunteer** | Report injured animals, refill feeding points, accept/reject tasks, donate, upload evidence |
| **vet** | Set availability, accept animal cases, enter diagnosis/treatment feedback |
| **user** | Report injured animals, track own report status |

## Rules

1. **ALWAYS** read `node_modules/next/dist/docs/` for Next.js conventions before writing route handlers
2. **NEVER** put business logic in route handlers — delegate to services
3. **NEVER** write raw SQL in services — use repositories
4. **ALWAYS** validate input with DTOs before passing to services
5. **ALWAYS** wrap route handlers with `handler()` for consistent error handling
6. Dynamic route params are a **Promise** in Next.js 16 — always `await params`
7. If a new DTO, service method, or repository method is needed, create it following existing patterns
8. Use `res.success()` for 200, `res.created()` for 201, `res.noContent()` for 204

## Database

- MariaDB running in Docker on `localhost:3307`
- Database name: `okulapp`
- Connection pool: `lib/db.ts`
- Tables: users, feeding_points, feeding_point_refills, reports, animals, tasks, task_evidence, vet_availability, vet_cases, donations, purchases, notifications, system_settings

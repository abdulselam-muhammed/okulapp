# 🐾 Hayvan Yardım — Animal Rescue System

A full-stack platform for coordinating street-animal rescue: citizens report injured or stray animals, advisors triage and assign tasks, volunteers respond, vets handle medical cases, and donations fund the operation — all on an interactive map.

Built with **Next.js 16**, **React 19**, **TypeScript**, and **MariaDB**, following a clean **layered backend architecture**.

---

## ✨ Features

- 🗺️ **Interactive map** of reports, feeding points, and nearby volunteers (Leaflet)
- 📣 **Report system** — citizens report injured animals or empty feeding points
- ✅ **Task assignment** — advisors assign tasks to volunteers, who upload photo evidence
- 🩺 **Vet module** — vets set availability and manage animal medical cases
- 🍽️ **Feeding points** — track refills with an advisor approval flow
- 💳 **Donations** — Stripe-powered payments with PDF invoices
- 🔔 **Real-time notifications** (Server-Sent Events)
- 🔐 **JWT authentication** + role-based authorization (CASL)
- 📊 **Activity logs** and an admin dashboard
- 📚 **OpenAPI / Swagger** docs served at `/docs`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) · React 19 |
| **Language** | TypeScript |
| **Database** | MariaDB (Docker) via `mysql2` connection pool |
| **Schema / Migrations** | Prisma |
| **Auth** | `jsonwebtoken` (JWT) + `bcryptjs` (password hashing) |
| **Authorization** | CASL (`@casl/ability`) |
| **Validation** | Zod |
| **Payments** | Stripe |
| **State** | Zustand |
| **Maps** | Leaflet / react-leaflet |
| **PDF** | jsPDF (invoices) |
| **Styling** | Tailwind CSS v4 |

---

## 🏗️ Architecture

The backend follows a strict **layered architecture**. Each request flows through clearly separated responsibilities:

```
Route Handler (Controller) → Service → Repository → Database
        ↑                       ↑
       DTO (Zod)             ApiError
```

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Controller** | `app/api/.../route.ts` | HTTP handling, validation, responses — no business logic |
| **DTO** | `lib/dto/` | Zod schemas validating incoming requests |
| **Service** | `lib/services/` | Business logic & domain rules — throws `ApiError`, never writes SQL |
| **Repository** | `lib/repositories/` | All database access — extends `BaseRepository` |

**Core rules:**
- Controllers delegate to services and never touch repositories directly.
- Services own business logic and never write raw SQL.
- Repositories own all SQL and know nothing about business rules.
- Errors are **thrown** as `ApiError`, never returned as codes.

---

## 👥 User Roles

| Role | Capabilities |
|------|--------------|
| **admin** | User/role management, purchases from donations, system settings, stats |
| **advisor** | Approve refills, assign & prioritize tasks, track volunteers |
| **volunteer** | Report animals, refill feeding points, accept tasks, upload evidence, donate |
| **vet** | Set availability, accept animal cases, record diagnosis & treatment |
| **user** | Report injured animals, track their own report status |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker (for MariaDB)

### 1. Clone & install

```bash
git clone <repo-url>
cd okulapp
npm install
```

### 2. Start the database

MariaDB runs in Docker on `localhost:3307` (database: `okulapp`):

```bash
docker run --name okulapp-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=okulapp \
  -p 3307:3306 \
  -d mariadb:latest
```

### 3. Configure environment

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MariaDB connection |
| `DATABASE_URL` | Prisma connection string |
| `JWT_SECRET` | Secret for signing JWTs (change in production!) |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test mode) |

### 4. Set up the schema & seed data

```bash
npm run db:push      # apply Prisma schema to the database
npm run seed         # seed users (default password: 123456)
npm run seed:content # seed projects & articles
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API docs live at [http://localhost:3000/docs](http://localhost:3000/docs).

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run seed` | Seed users |
| `npm run seed:clean` | Remove seeded data |
| `npm run seed:content` | Seed projects & articles |

---

## 🔐 Authentication

- **Passwords** are hashed with `bcryptjs` (cost factor 12).
- **Sessions** use stateless JWTs (`jsonwebtoken`, 7-day expiry) sent as `Authorization: Bearer <token>`.
- Public routes: `POST /api/auth/register`, `POST /api/auth/login`.
- All other `/api/*` routes require a valid token; role checks are enforced per-route via `getAuth()` / `requireRole()`.

---

## 🗄️ Data Model

13 core tables: `users`, `feeding_points`, `feeding_point_refills`, `reports`, `animals`, `tasks`, `task_evidence`, `vet_availability`, `vet_cases`, `donations`, `purchases`, `notifications`, `system_settings`.

See [`prisma/schema.prisma`](prisma/schema.prisma) for the full schema.

---

## 📁 Project Structure

```
app/                  # Next.js App Router (pages + API routes)
  api/                # Route handlers (controllers)
  (landing)/          # Public-facing pages
  dashboard/          # Authenticated dashboard
lib/
  dto/                # Zod validation schemas
  services/           # Business logic
  repositories/       # Database access
  helpers/            # auth, controller, api-response, ApiError, etc.
  swagger/            # OpenAPI spec
prisma/               # Database schema
scripts/              # Seed & maintenance scripts
```

---

## 📄 License

This project is **source-available** under the
[PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/).

You are free to **view, use, modify, and share** this code for **personal,
educational, and other non-commercial purposes**. **Commercial use is not
permitted** — you may not use this software, or any derivative of it, to run a
business or for any other commercial advantage without explicit written
permission from the author.

See the [LICENSE](LICENSE) file for full terms.

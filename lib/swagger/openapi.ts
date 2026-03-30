/**
 * OpenAPI 3.0 Specification for the Hayvan Yardim API.
 *
 * When adding a new endpoint, add its path and schemas here.
 * The spec is served at GET /api/docs and rendered at /docs.
 */

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Hayvan Yardim API",
    description:
      "Animal rescue & help system. Manages reports, tasks, feeding points, donations, and vet cases.",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],

  // ── Security ──────────────────────────────────────────────
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http" as const,
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      // ── Common ──────────────────────────────────────────
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              details: {},
            },
          },
        },
      },

      // ── Auth ────────────────────────────────────────────
      RegisterRequest: {
        type: "object",
        required: ["email", "password", "role", "first_name", "last_name"],
        properties: {
          email: { type: "string", format: "email", example: "ali@example.com" },
          password: { type: "string", minLength: 6, example: "123456" },
          role: {
            type: "string",
            enum: ["admin", "advisor", "volunteer", "vet", "user"],
            example: "volunteer",
          },
          first_name: { type: "string", example: "Ali" },
          last_name: { type: "string", example: "Yilmaz" },
          phone: { type: "string", example: "05551234567" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "ali@example.com" },
          password: { type: "string", example: "123456" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
              token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
            },
          },
        },
      },

      // ── User ────────────────────────────────────────────
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", example: "ali@example.com" },
          role: {
            type: "string",
            enum: ["admin", "advisor", "volunteer", "vet", "user"],
          },
          first_name: { type: "string", example: "Ali" },
          last_name: { type: "string", example: "Yilmaz" },
          phone: { type: "string", nullable: true },
          avatar_url: { type: "string", nullable: true },
          latitude: { type: "number", nullable: true },
          longitude: { type: "number", nullable: true },
          reliability_score: { type: "number", example: 0.5 },
          is_active: { type: "boolean", example: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      // ── Report ──────────────────────────────────────────
      CreateReportRequest: {
        type: "object",
        required: ["type", "description", "latitude", "longitude"],
        properties: {
          type: {
            type: "string",
            enum: ["injured_animal", "feeding_point"],
            example: "injured_animal",
          },
          description: { type: "string", example: "Yarali kedi, sol arka bacak kirik" },
          latitude: { type: "number", example: 39.9208 },
          longitude: { type: "number", example: 32.8541 },
          address: { type: "string", example: "Kizilay, Ankara" },
          photo_url: { type: "string", format: "uri" },
          species: { type: "string", example: "Kedi" },
          condition_level: {
            type: "string",
            enum: ["minor", "moderate", "severe", "critical"],
          },
        },
      },
      UpdateReportStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: [
              "pending", "approved", "assigned", "in_progress",
              "completed", "rejected", "needs_correction",
            ],
          },
          correction_note: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
        },
      },
      Report: {
        type: "object",
        properties: {
          id: { type: "integer" },
          reporter_id: { type: "integer" },
          type: { type: "string", enum: ["injured_animal", "feeding_point"] },
          description: { type: "string" },
          latitude: { type: "number" },
          longitude: { type: "number" },
          address: { type: "string", nullable: true },
          photo_url: { type: "string", nullable: true },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          status: { type: "string" },
          correction_note: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      // ── Task ────────────────────────────────────────────
      CreateTaskRequest: {
        type: "object",
        required: ["assigned_to", "type"],
        properties: {
          report_id: { type: "integer" },
          assigned_to: { type: "integer", example: 2 },
          type: {
            type: "string",
            enum: ["rescue", "feeding", "vet_transport", "other"],
            example: "rescue",
          },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          notes: { type: "string" },
          deadline: { type: "string", format: "date-time" },
        },
      },
      UpdateTaskStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["pending", "accepted", "rejected", "in_progress", "completed", "cancelled"],
          },
          rejection_reason: { type: "string" },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "integer" },
          report_id: { type: "integer", nullable: true },
          assigned_by: { type: "integer", nullable: true },
          assigned_to: { type: "integer", nullable: true },
          type: { type: "string" },
          status: { type: "string" },
          priority: { type: "string" },
          notes: { type: "string", nullable: true },
          rejection_reason: { type: "string", nullable: true },
          deadline: { type: "string", format: "date-time", nullable: true },
          started_at: { type: "string", format: "date-time", nullable: true },
          completed_at: { type: "string", format: "date-time", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },

      // ── Feeding Point ───────────────────────────────────
      CreateFeedingPointRequest: {
        type: "object",
        required: ["name", "latitude", "longitude"],
        properties: {
          name: { type: "string", example: "Kizilay Parki Mama Noktasi" },
          latitude: { type: "number", example: 39.9208 },
          longitude: { type: "number", example: 32.8541 },
          description: { type: "string" },
        },
      },
      RefillFeedingPointRequest: {
        type: "object",
        required: ["refill_type"],
        properties: {
          refill_type: { type: "string", enum: ["food", "water", "both"], example: "both" },
          note: { type: "string" },
          photo_url: { type: "string", format: "uri" },
        },
      },
      FeedingPoint: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          latitude: { type: "number" },
          longitude: { type: "number" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "needs_refill", "inactive"] },
          last_refill_at: { type: "string", format: "date-time", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },

      // ── Donation ────────────────────────────────────────
      CreateDonationRequest: {
        type: "object",
        required: ["amount"],
        properties: {
          amount: { type: "number", example: 100.0 },
          payment_method: { type: "string", example: "credit_card" },
          note: { type: "string" },
        },
      },
      CreatePurchaseRequest: {
        type: "object",
        required: ["description", "amount"],
        properties: {
          description: { type: "string", example: "50kg kedi mamasi" },
          amount: { type: "number", example: 250.0 },
          receipt_url: { type: "string", format: "uri" },
        },
      },

      // ── Vet ─────────────────────────────────────────────
      UpdateVetAvailabilityRequest: {
        type: "object",
        required: ["is_available"],
        properties: {
          is_available: { type: "boolean", example: true },
          workload: { type: "string", enum: ["light", "moderate", "heavy"] },
          note: { type: "string" },
        },
      },
      CreateVetCaseRequest: {
        type: "object",
        required: ["animal_id"],
        properties: {
          animal_id: { type: "integer", example: 1 },
          task_id: { type: "integer" },
          diagnosis: { type: "string" },
          treatment: { type: "string" },
          notes: { type: "string" },
        },
      },
      UpdateVetCaseRequest: {
        type: "object",
        properties: {
          diagnosis: { type: "string" },
          treatment: { type: "string" },
          outcome: { type: "string", enum: ["ongoing", "recovered", "released", "deceased"] },
          notes: { type: "string" },
        },
      },
    },
  },

  security: [{ bearerAuth: [] }],

  // ── Paths ─────────────────────────────────────────────────
  tags: [
    { name: "Auth", description: "Authentication & registration" },
    { name: "Users", description: "User management (admin)" },
    { name: "Reports", description: "Injured animal & feeding point reports" },
    { name: "Tasks", description: "Task assignment & tracking" },
    { name: "Feeding Points", description: "Feeding/water station management" },
    { name: "Donations", description: "Donations & purchases" },
    { name: "Vet", description: "Veterinary availability & cases" },
    { name: "Notifications", description: "User notifications" },
  ],

  paths: {
    // ── Auth ──────────────────────────────────────────────
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "409": { description: "Email already in use" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email & password",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "401": { description: "Invalid email or password" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },

    // ── Users ─────────────────────────────────────────────
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List all users (admin only)",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          { name: "role", in: "query", schema: { type: "string", enum: ["admin", "advisor", "volunteer", "vet", "user"] } },
        ],
        responses: {
          "200": {
            description: "User list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/User" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "User found" },
          "404": { description: "User not found" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update a user",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  first_name: { type: "string" },
                  last_name: { type: "string" },
                  phone: { type: "string" },
                  is_active: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "User updated" },
          "404": { description: "User not found" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user (admin only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "204": { description: "User deleted" },
          "404": { description: "User not found" },
        },
      },
    },

    // ── Reports ───────────────────────────────────────────
    "/api/reports": {
      get: {
        tags: ["Reports"],
        summary: "List reports",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "lat", in: "query", schema: { type: "number" }, description: "Nearby search latitude" },
          { name: "lng", in: "query", schema: { type: "number" }, description: "Nearby search longitude" },
          { name: "radius", in: "query", schema: { type: "number", default: 10 }, description: "Search radius in km" },
        ],
        responses: {
          "200": {
            description: "Report list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Report" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Reports"],
        summary: "Create a new report (injured animal or feeding point)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateReportRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Report created" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/reports/{id}": {
      get: {
        tags: ["Reports"],
        summary: "Get report by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Report found" },
          "404": { description: "Report not found" },
        },
      },
      patch: {
        tags: ["Reports"],
        summary: "Update report status (advisor only)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateReportStatusRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Report status updated" },
          "403": { description: "Forbidden" },
          "404": { description: "Report not found" },
        },
      },
    },

    // ── Tasks ─────────────────────────────────────────────
    "/api/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List tasks",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          "200": {
            description: "Task list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Task" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create & assign a task (advisor only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Task created" },
          "409": { description: "Volunteer has conflicting active task" },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get task by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Task found" },
          "404": { description: "Task not found" },
        },
      },
      patch: {
        tags: ["Tasks"],
        summary: "Update task status (volunteer accepts/rejects/completes)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskStatusRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Task status updated" },
          "404": { description: "Task not found" },
        },
      },
    },
    "/api/tasks/{id}/evidence": {
      post: {
        tags: ["Tasks"],
        summary: "Upload evidence for a task (volunteer)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["photo_url"],
                properties: {
                  photo_url: { type: "string", format: "uri" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Evidence added" },
        },
      },
    },

    // ── Feeding Points ────────────────────────────────────
    "/api/feeding-points": {
      get: {
        tags: ["Feeding Points"],
        summary: "List all feeding points",
        responses: {
          "200": {
            description: "Feeding points list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/FeedingPoint" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Feeding Points"],
        summary: "Create a new feeding point",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateFeedingPointRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Feeding point created" },
        },
      },
    },
    "/api/feeding-points/{id}/refill": {
      post: {
        tags: ["Feeding Points"],
        summary: "Refill a feeding point (volunteer)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefillFeedingPointRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Refill submitted for approval" },
        },
      },
    },

    // ── Donations ─────────────────────────────────────────
    "/api/donations": {
      get: {
        tags: ["Donations"],
        summary: "List all donations",
        responses: {
          "200": { description: "Donation list" },
        },
      },
      post: {
        tags: ["Donations"],
        summary: "Make a donation (volunteer/user)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateDonationRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Donation recorded" },
        },
      },
    },
    "/api/donations/balance": {
      get: {
        tags: ["Donations"],
        summary: "Get current donation pool balance (admin)",
        responses: {
          "200": {
            description: "Balance",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: { balance: { type: "number" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/donations/purchases": {
      post: {
        tags: ["Donations"],
        summary: "Make a purchase from donation pool (admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePurchaseRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Purchase recorded" },
          "400": { description: "Insufficient balance" },
        },
      },
    },

    // ── Vet ───────────────────────────────────────────────
    "/api/vet/availability": {
      get: {
        tags: ["Vet"],
        summary: "List available vets",
        responses: {
          "200": { description: "Available vets" },
        },
      },
      put: {
        tags: ["Vet"],
        summary: "Update own availability (vet only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateVetAvailabilityRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Availability updated" },
        },
      },
    },
    "/api/vet/cases": {
      get: {
        tags: ["Vet"],
        summary: "List own vet cases",
        responses: {
          "200": { description: "Vet case list" },
        },
      },
      post: {
        tags: ["Vet"],
        summary: "Create a vet case (vet only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateVetCaseRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Vet case created" },
        },
      },
    },
    "/api/vet/cases/{id}": {
      patch: {
        tags: ["Vet"],
        summary: "Update vet case (diagnosis, treatment, outcome)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateVetCaseRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Vet case updated" },
          "404": { description: "Vet case not found" },
        },
      },
    },

    // ── Notifications ─────────────────────────────────────
    "/api/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "List own notifications",
        parameters: [
          { name: "unread", in: "query", schema: { type: "boolean" }, description: "Filter unread only" },
        ],
        responses: {
          "200": { description: "Notification list" },
        },
      },
    },
    "/api/notifications/{id}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark a notification as read",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Marked as read" },
        },
      },
    },
    "/api/notifications/read-all": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark all notifications as read",
        responses: {
          "200": { description: "All marked as read" },
        },
      },
    },
  },
};

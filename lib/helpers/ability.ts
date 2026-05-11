import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability";

/**
 * CASL ability definitions for the Hayvan Yardim frontend.
 *
 * Mirror the backend role checks to prevent 403 errors by not firing
 * API requests the user isn't allowed to make, and to hide unauthorized
 * UI elements.
 */

export type Actions =
  | "manage"  // wildcard — all actions
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve";

export type Subjects =
  | "all"
  | "User"
  | "Role"
  | "Donation"
  | "DonationBalance"
  | "Purchase"
  | "Vet"
  | "VetAvailability"
  | "VetCase"
  | "Task"
  | "Report"
  | "FeedingPoint"
  | "Refill"
  | "Notification"
  | "Dashboard"
  | "DashboardStats"
  | "ActivityLog"
  | "Project"
  | "Article";

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(role: string | null | undefined): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Everyone (including guests) can do these basics
  can("read", "Dashboard");
  can("read", "Notification");
  can("update", "Notification"); // mark as read
  can("create", "Donation"); // guest donations allowed
  can("create", "Report");
  // Public landing pages
  can("read", "Project");
  can("read", "Article");

  switch (role) {
    case "admin":
      // Admin can do everything
      can("manage", "all");
      break;

    case "advisor":
      // Users
      can("read", "User");
      // Donations
      can("read", "Donation");
      can("read", "DonationBalance");
      // Vets
      can("read", "Vet");
      can("read", "VetAvailability");
      // Tasks
      can("read", "Task");
      can("create", "Task");
      can("update", "Task");
      // Reports
      can("read", "Report");
      can("update", "Report");
      // Feeding points
      can("read", "FeedingPoint");
      can("create", "FeedingPoint");
      can("approve", "Refill");
      // Activity logs (audit trail)
      can("read", "ActivityLog");
      // Dashboard
      can("read", "DashboardStats");
      break;

    case "volunteer":
      // Can see own tasks only (server enforces)
      can("read", "Task");
      can("update", "Task"); // accept / reject / complete own
      // Feeding points
      can("read", "FeedingPoint");
      can("create", "Refill");
      // Reports — can create and see own
      can("read", "Report");
      break;

    case "vet":
      // Vet management
      can("read", "Vet");
      can("read", "VetAvailability");
      can("update", "VetAvailability"); // own availability
      can("create", "VetCase");
      can("read", "VetCase");
      can("update", "VetCase");
      // See tasks assigned
      can("read", "Task");
      can("update", "Task");
      // Feeding points
      can("read", "FeedingPoint");
      break;

    case "user":
      // Regular user — minimal access, only own reports
      can("read", "Report"); // server filters to own
      break;

    default:
      // Guest — only what's in the base case above
      break;
  }

  return build();
}

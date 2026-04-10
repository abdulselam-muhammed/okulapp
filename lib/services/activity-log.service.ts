import { activityLogRepository, type ActivityAction } from "@/lib/repositories/activity-log.repository";

/**
 * Centralized activity logger. Call `activityLog.log(...)` from any service
 * after a mutation to record it in the activity_logs table.
 *
 * Logging never throws — failures are silently swallowed so the primary
 * action (e.g. task creation) always succeeds even if logging fails.
 */
export const activityLog = {
  async log(
    userId: number | null,
    action: ActivityAction,
    entityType: string,
    entityId: number | null,
    description: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await activityLogRepository.create({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
    } catch (err) {
      console.error("activityLog.log failed:", err);
    }
  },

  async getAll(limit = 100, offset = 0) {
    return activityLogRepository.findAllWithUser(limit, offset);
  },

  async getByEntity(entityType: string, entityId: number) {
    return activityLogRepository.findByEntity(entityType, entityId);
  },
};

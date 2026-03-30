import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";

export interface NotificationRow extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_type: string | null;
  related_id: number | null;
  created_at: Date;
}

class NotificationRepository extends BaseRepository<NotificationRow> {
  constructor() {
    super("notifications");
  }

  async findByUser(
    userId: number,
    unreadOnly = false,
    limit = 50,
    offset = 0
  ): Promise<NotificationRow[]> {
    if (unreadOnly) {
      return this.findWhere({ user_id: userId, is_read: false }, limit, offset);
    }
    return this.findWhere({ user_id: userId }, limit, offset);
  }

  async markAsRead(notificationId: number): Promise<boolean> {
    return this.update(notificationId, { is_read: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.execute(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
      [userId]
    );
  }

  async send(
    userId: number,
    title: string,
    message: string,
    type: string,
    relatedType?: string,
    relatedId?: number
  ): Promise<number> {
    return this.create({
      user_id: userId,
      title,
      message,
      type,
      related_type: relatedType ?? null,
      related_id: relatedId ?? null,
    });
  }
}

export const notificationRepository = new NotificationRepository();

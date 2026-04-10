import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";

export interface DonationRow extends RowDataPacket {
  id: number;
  donor_id: number;
  amount: number;
  payment_method: string | null;
  note: string | null;
  created_at: Date;
}

export interface PurchaseRow extends RowDataPacket {
  id: number;
  admin_id: number;
  description: string;
  amount: number;
  receipt_url: string | null;
  created_at: Date;
}

export interface DonationWithDonor extends DonationRow {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

class DonationRepository extends BaseRepository<DonationRow> {
  constructor() {
    super("donations");
  }

  async findAllWithDonor(limit = 50, offset = 0): Promise<DonationWithDonor[]> {
    return this.query<DonationWithDonor[]>(
      `SELECT d.*, u.first_name, u.last_name, u.email
       FROM donations d
       LEFT JOIN users u ON u.id = d.donor_id
       ORDER BY d.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async totalDonations(): Promise<number> {
    const rows = await this.query<(RowDataPacket & { total: number })[]>(
      "SELECT COALESCE(SUM(amount), 0) as total FROM donations"
    );
    return rows[0].total;
  }

  async totalPurchases(): Promise<number> {
    const rows = await this.query<(RowDataPacket & { total: number })[]>(
      "SELECT COALESCE(SUM(amount), 0) as total FROM purchases"
    );
    return rows[0].total;
  }

  async getBalance(): Promise<number> {
    const [donations, purchases] = await Promise.all([
      this.totalDonations(),
      this.totalPurchases(),
    ]);
    return donations - purchases;
  }

  async createPurchase(data: Record<string, unknown>): Promise<number> {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    const result = await this.execute(
      `INSERT INTO purchases (${columns}) VALUES (${placeholders})`,
      Object.values(data)
    );
    return result.insertId;
  }
}

export const donationRepository = new DonationRepository();

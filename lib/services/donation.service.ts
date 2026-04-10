import { donationRepository } from "@/lib/repositories/donation.repository";
import { userRepository } from "@/lib/repositories/user.repository";
import { activityLog } from "@/lib/services/activity-log.service";
import { ApiError } from "@/lib/helpers/api-error";
import { hashPassword } from "@/lib/helpers/auth";
import type { CreateDonationDto, CreatePurchaseDto } from "@/lib/dto/donation.dto";

export const donationService = {
  async getAll(limit?: number, offset?: number) {
    return donationRepository.findAllWithDonor(limit, offset);
  },

  async getBalance() {
    return donationRepository.getBalance();
  },

  async donate(donorId: number, dto: CreateDonationDto) {
    const id = await donationRepository.create({
      donor_id: donorId,
      amount: dto.amount,
      payment_method: dto.payment_method ?? null,
      note: dto.note ?? null,
    });

    await activityLog.log(
      donorId,
      "create",
      "donation",
      id,
      `Made a donation of $${dto.amount}${dto.payment_method ? ` via ${dto.payment_method}` : ""}`,
      { amount: dto.amount, payment_method: dto.payment_method }
    );

    return donationRepository.findById(id);
  },

  /**
   * Find an existing user by email or create a guest user.
   * Used when unauthenticated donors donate via Stripe.
   */
  async findOrCreateGuestDonor(email: string, name: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) return existing.id;

    // Split name into first + last
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || "Guest";
    const lastName = parts.slice(1).join(" ") || "Donor";

    // Random password (guest won't log in with it)
    const randomPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const passwordHash = await hashPassword(randomPassword);

    const userId = await userRepository.create({
      email,
      password_hash: passwordHash,
      role: "user",
      first_name: firstName,
      last_name: lastName,
    });
    return userId;
  },

  async donateAsGuest(dto: CreateDonationDto) {
    if (!dto.guest_email || !dto.guest_name) {
      throw ApiError.badRequest("Guest donors must provide name and email");
    }

    const donorId = await donationService.findOrCreateGuestDonor(dto.guest_email, dto.guest_name);

    const id = await donationRepository.create({
      donor_id: donorId,
      amount: dto.amount,
      payment_method: dto.payment_method ?? null,
      note: dto.note ?? null,
    });

    await activityLog.log(
      donorId,
      "create",
      "donation",
      id,
      `Guest donated $${dto.amount} (${dto.guest_name})`,
      { amount: dto.amount, guest: true }
    );

    return donationRepository.findById(id);
  },

  async purchase(adminId: number, dto: CreatePurchaseDto) {
    const balance = await donationRepository.getBalance();
    if (balance < dto.amount) {
      throw ApiError.badRequest(
        `Insufficient donation balance. Available: ${balance}, Requested: ${dto.amount}`
      );
    }

    const id = await donationRepository.createPurchase({
      admin_id: adminId,
      description: dto.description,
      amount: dto.amount,
      receipt_url: dto.receipt_url ?? null,
    });

    await activityLog.log(
      adminId,
      "create",
      "purchase",
      id,
      `Recorded purchase of $${dto.amount}: ${dto.description}`,
      { amount: dto.amount, description: dto.description }
    );

    return id;
  },
};

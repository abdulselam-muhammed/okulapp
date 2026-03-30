import { donationRepository } from "@/lib/repositories/donation.repository";
import { ApiError } from "@/lib/helpers/api-error";
import type { CreateDonationDto, CreatePurchaseDto } from "@/lib/dto/donation.dto";

export const donationService = {
  async getAll(limit?: number, offset?: number) {
    return donationRepository.findAll(limit, offset);
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
    return id;
  },
};

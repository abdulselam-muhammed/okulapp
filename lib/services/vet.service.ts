import { vetRepository } from "@/lib/repositories/vet.repository";
import { ApiError } from "@/lib/helpers/api-error";
import type {
  UpdateVetAvailabilityDto,
  CreateVetCaseDto,
  UpdateVetCaseDto,
} from "@/lib/dto/vet.dto";

export const vetService = {
  async getAvailableVets() {
    return vetRepository.findAvailableVets();
  },

  async updateAvailability(vetId: number, dto: UpdateVetAvailabilityDto) {
    await vetRepository.upsertAvailability(vetId, dto);
  },

  async createCase(vetId: number, dto: CreateVetCaseDto) {
    const id = await vetRepository.createCase({
      animal_id: dto.animal_id,
      vet_id: vetId,
      task_id: dto.task_id ?? null,
      diagnosis: dto.diagnosis ?? null,
      treatment: dto.treatment ?? null,
      notes: dto.notes ?? null,
    });
    return id;
  },

  async updateCase(caseId: number, dto: UpdateVetCaseDto) {
    const updated = await vetRepository.updateCase(caseId, dto);
    if (!updated) throw ApiError.notFound("Vet case not found");
  },

  async getCasesByVet(vetId: number) {
    return vetRepository.findCasesByVet(vetId);
  },
};

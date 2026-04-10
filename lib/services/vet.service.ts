import { vetRepository } from "@/lib/repositories/vet.repository";
import { activityLog } from "@/lib/services/activity-log.service";
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

    await activityLog.log(
      vetId,
      "update",
      "vet_availability",
      vetId,
      `Updated availability: ${dto.is_available ? "Available" : "Unavailable"}${dto.workload ? ` (${dto.workload})` : ""}`,
      { is_available: dto.is_available, workload: dto.workload }
    );
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

    await activityLog.log(
      vetId,
      "create",
      "vet_case",
      id,
      `Created vet case #${id} for animal #${dto.animal_id}`,
      { animal_id: dto.animal_id, diagnosis: dto.diagnosis }
    );

    return id;
  },

  async updateCase(caseId: number, dto: UpdateVetCaseDto, actorId: number | null = null) {
    const updated = await vetRepository.updateCase(caseId, dto);
    if (!updated) throw ApiError.notFound("Vet case not found");

    await activityLog.log(
      actorId,
      "update",
      "vet_case",
      caseId,
      `Updated vet case #${caseId}${dto.outcome ? ` (outcome: ${dto.outcome})` : ""}`,
      { outcome: dto.outcome }
    );
  },

  async getCasesByVet(vetId: number) {
    return vetRepository.findCasesByVet(vetId);
  },
};

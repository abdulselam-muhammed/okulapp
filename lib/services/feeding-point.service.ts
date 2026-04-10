import { feedingPointRepository } from "@/lib/repositories/feeding-point.repository";
import { activityLog } from "@/lib/services/activity-log.service";
import { ApiError } from "@/lib/helpers/api-error";
import type { CreateFeedingPointDto, RefillFeedingPointDto } from "@/lib/dto/feeding-point.dto";

export const feedingPointService = {
  async getAll(limit?: number, offset?: number) {
    return feedingPointRepository.findAll(limit, offset);
  },

  async getById(id: number) {
    const point = await feedingPointRepository.findById(id);
    if (!point) throw ApiError.notFound("Feeding point not found");
    return point;
  },

  async create(createdBy: number, dto: CreateFeedingPointDto) {
    const id = await feedingPointRepository.create({
      name: dto.name,
      latitude: dto.latitude,
      longitude: dto.longitude,
      description: dto.description ?? null,
      created_by: createdBy,
    });

    await activityLog.log(
      createdBy,
      "create",
      "feeding_point",
      id,
      `Created feeding point "${dto.name}"`,
      { name: dto.name }
    );

    return feedingPointRepository.findById(id);
  },

  async refill(feedingPointId: number, volunteerId: number, dto: RefillFeedingPointDto) {
    await feedingPointService.getById(feedingPointId); // ensure exists

    const refillId = await feedingPointRepository.createRefill({
      feeding_point_id: feedingPointId,
      volunteer_id: volunteerId,
      refill_type: dto.refill_type,
      note: dto.note ?? null,
      photo_url: dto.photo_url ?? null,
    });

    await activityLog.log(
      volunteerId,
      "create",
      "refill",
      refillId,
      `Submitted ${dto.refill_type} refill for feeding point #${feedingPointId}`,
      { feeding_point_id: feedingPointId, refill_type: dto.refill_type }
    );

    return refillId;
  },

  async approveRefill(refillId: number, advisorId: number) {
    await feedingPointRepository.execute(
      `UPDATE feeding_point_refills SET status = 'approved', approved_by = ? WHERE id = ?`,
      [advisorId, refillId]
    );

    // Update the feeding point status and last refill time
    const [refill] = await feedingPointRepository.query<any[]>(
      `SELECT * FROM feeding_point_refills WHERE id = ?`,
      [refillId]
    );
    if (refill) {
      await feedingPointRepository.update(refill.feeding_point_id, {
        status: "active",
        last_refill_at: new Date(),
      });
    }

    await activityLog.log(
      advisorId,
      "approve",
      "refill",
      refillId,
      `Approved refill request #${refillId}`,
      { feeding_point_id: refill?.feeding_point_id }
    );
  },

  async getRefills(feedingPointId: number) {
    return feedingPointRepository.findRefillsByPoint(feedingPointId);
  },
};

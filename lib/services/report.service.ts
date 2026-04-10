import { reportRepository } from "@/lib/repositories/report.repository";
import { animalRepository } from "@/lib/repositories/animal.repository";
import { notificationRepository } from "@/lib/repositories/notification.repository";
import { activityLog } from "@/lib/services/activity-log.service";
import { ApiError } from "@/lib/helpers/api-error";
import type { CreateReportDto, UpdateReportStatusDto } from "@/lib/dto/report.dto";

export const reportService = {
  async getAll(limit?: number, offset?: number) {
    return reportRepository.findAll(limit, offset);
  },

  async getById(id: number) {
    const report = await reportRepository.findById(id);
    if (!report) throw ApiError.notFound("Report not found");
    return report;
  },

  async getPending(limit?: number, offset?: number) {
    return reportRepository.findPending(limit, offset);
  },

  async getByReporter(reporterId: number) {
    return reportRepository.findByReporter(reporterId);
  },

  async getNearby(lat: number, lng: number, radiusKm?: number) {
    return reportRepository.findNear(lat, lng, radiusKm);
  },

  async create(reporterId: number, dto: CreateReportDto) {
    const reportId = await reportRepository.create({
      reporter_id: reporterId,
      type: dto.type,
      description: dto.description,
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address ?? null,
      photo_url: dto.photo_url ?? null,
    });

    // If injured animal, also create animal record
    if (dto.type === "injured_animal") {
      await animalRepository.create({
        report_id: reportId,
        species: dto.species ?? null,
        description: dto.description,
        condition_level: dto.condition_level ?? "moderate",
        photo_url: dto.photo_url ?? null,
      });
    }

    await activityLog.log(
      reporterId,
      "create",
      "report",
      reportId,
      `Created ${dto.type} report #${reportId}${dto.species ? ` (${dto.species})` : ""}`,
      { type: dto.type, condition: dto.condition_level }
    );

    return reportRepository.findById(reportId);
  },

  async updateStatus(id: number, dto: UpdateReportStatusDto, actorId: number | null = null) {
    const report = await reportService.getById(id);

    await reportRepository.update(id, {
      status: dto.status,
      ...(dto.correction_note && { correction_note: dto.correction_note }),
      ...(dto.priority && { priority: dto.priority }),
    });

    // Notify reporter about status change
    await notificationRepository.send(
      report.reporter_id,
      "Report Status Updated",
      `Your report #${id} status changed to: ${dto.status}`,
      "report_status",
      "report",
      id
    );

    await activityLog.log(
      actorId,
      "status_change",
      "report",
      id,
      `Changed report #${id} status to ${dto.status}`,
      { from: report.status, to: dto.status }
    );

    return reportRepository.findById(id);
  },
};

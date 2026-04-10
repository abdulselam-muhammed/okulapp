import { taskRepository } from "@/lib/repositories/task.repository";
import { notificationRepository } from "@/lib/repositories/notification.repository";
import { activityLog } from "@/lib/services/activity-log.service";
import { ApiError } from "@/lib/helpers/api-error";
import type { CreateTaskDto, UpdateTaskStatusDto } from "@/lib/dto/task.dto";

export const taskService = {
  async getAll(limit?: number, offset?: number) {
    return taskRepository.findAll(limit, offset);
  },

  async getById(id: number) {
    const task = await taskRepository.findById(id);
    if (!task) throw ApiError.notFound("Task not found");
    return task;
  },

  async getByVolunteer(volunteerId: number) {
    return taskRepository.findActiveByVolunteer(volunteerId);
  },

  async create(advisorId: number, dto: CreateTaskDto) {
    // Check for task conflicts
    const hasConflict = await taskRepository.hasConflict(dto.assigned_to);
    if (hasConflict) {
      throw ApiError.conflict(
        "Volunteer already has an active task. Complete or cancel it first."
      );
    }

    const id = await taskRepository.create({
      report_id: dto.report_id ?? null,
      assigned_by: advisorId,
      assigned_to: dto.assigned_to,
      type: dto.type,
      priority: dto.priority ?? "medium",
      notes: dto.notes ?? null,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
    });

    // Notify volunteer
    await notificationRepository.send(
      dto.assigned_to,
      "New Task Assigned",
      `You have been assigned a new ${dto.type} task. Priority: ${dto.priority ?? "medium"}`,
      "task_assigned",
      "task",
      id
    );

    await activityLog.log(
      advisorId,
      "create",
      "task",
      id,
      `Created ${dto.type} task #${id} and assigned to volunteer #${dto.assigned_to}`,
      { type: dto.type, priority: dto.priority ?? "medium", assigned_to: dto.assigned_to }
    );

    return taskRepository.findById(id);
  },

  async updateStatus(
    taskId: number,
    userId: number,
    dto: UpdateTaskStatusDto
  ) {
    const task = await taskService.getById(taskId);

    const updateData: Record<string, unknown> = { status: dto.status };

    if (dto.status === "rejected") {
      updateData.rejection_reason = dto.rejection_reason ?? null;
    }
    if (dto.status === "in_progress") {
      updateData.started_at = new Date();
    }
    if (dto.status === "completed") {
      updateData.completed_at = new Date();
    }

    await taskRepository.update(taskId, updateData);

    // Notify advisor about status change
    if (task.assigned_by) {
      await notificationRepository.send(
        task.assigned_by,
        "Task Status Updated",
        `Task #${taskId} status changed to: ${dto.status}`,
        "task_updated",
        "task",
        taskId
      );
    }

    await activityLog.log(
      userId,
      "status_change",
      "task",
      taskId,
      `Changed task #${taskId} status to ${dto.status}`,
      { from: task.status, to: dto.status }
    );

    return taskRepository.findById(taskId);
  },

  async addEvidence(taskId: number, userId: number, photoUrl: string, description?: string) {
    await taskService.getById(taskId); // ensure exists
    await taskRepository.execute(
      `INSERT INTO task_evidence (task_id, uploaded_by, photo_url, description) VALUES (?, ?, ?, ?)`,
      [taskId, userId, photoUrl, description ?? null]
    );
  },
};

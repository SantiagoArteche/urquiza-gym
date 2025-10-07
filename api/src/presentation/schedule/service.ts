import { IRepository } from "../../data/repository";
import {
  CreateScheduleEntryDTO,
  ScheduleEntry,
  UpdateScheduleEntryDTO,
} from "./types";

export class ScheduleService {
  constructor(private readonly repository: IRepository) {}

  getSchedule(): ScheduleEntry[] {
    const file = this.repository.getAll("schedule", "none");
    return file.schedule || [];
  }

  upsertEntry(data: CreateScheduleEntryDTO | UpdateScheduleEntryDTO) {
    const file = this.repository.getAll("schedule", "none");
    const schedule: ScheduleEntry[] = file.schedule || [];

    const isExistingEntry = "id" in data;
    if (isExistingEntry) {
      const entryId = Number(data.id);

      if (Number.isNaN(entryId)) return [{ message: "Invalid id", code: 400 }];

      const existing = schedule.find((e) => e.id === entryId);
      if (!existing) return [{ message: "Entry not found", code: 404 }];

      const clash = schedule.find(
        (e) => e.day === data.day && e.time === data.time && e.id !== entryId
      );
      if (clash) return [{ message: "Day/time already used", code: 409 }];

      const updated: ScheduleEntry = { ...existing, ...data, id: entryId };

      return this.repository.updateById(entryId, updated, "schedule");
    }

    const existingSlot = schedule.find(
      (e) => e.day === data.day && e.time === data.time
    );

    if (existingSlot) {
      const updated: ScheduleEntry = {
        ...existingSlot,
        ...data,
        id: existingSlot.id,
      };

      return this.repository.updateById(updated.id, updated, "schedule");
    }

    return this.repository.create(data, "schedule");
  }

  deleteEntry(id: number) {
    return this.repository.deleteById(id, "schedule");
  }
}

import { IRepository } from "../../data/repository";
import {
  CreateScheduleEntryDTO,
  ScheduleEntry,
  UpdateScheduleEntryDTO,
} from "./types";

const ALLOWED_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const MAX_PARTICIPANTS = 10;

type ServiceError = { message: string; code?: number } & Record<
  string,
  unknown
>;
type ServiceResult<T> = [ServiceError | null, T | undefined];

export class ScheduleService {
  constructor(private readonly repository: IRepository) {}

  async getSchedule(): Promise<ServiceResult<ScheduleEntry[]>> {
    const file = await this.repository.getAll("schedule", "none");
    const schedule: ScheduleEntry[] = file.schedule || [];
    const normalized = schedule.map((entry) => ({
      ...entry,
      participants: entry.participants || [],
    }));
    return [null, normalized];
  }

  async upsertEntry(
    data: CreateScheduleEntryDTO | UpdateScheduleEntryDTO
  ): Promise<ServiceResult<ScheduleEntry>> {
    const validationError = this.#validatePayload(data);
    if (validationError) return this.#error(validationError, 400);

    const schedule = await this.#getScheduleArray();

    return "id" in data
      ? this.#updateExisting(data, schedule)
      : this.#createOrReplaceSlot(data, schedule);
  }

  async deleteEntry(id: number | string): Promise<ServiceResult<boolean>> {
    const [err, result] = await this.repository.deleteById(id, "schedule");
    if (err) return [err, undefined];
    return [null, Boolean(result)];
  }

  async joinClass(
    entryId: number | string,
    countryId: string
  ): Promise<ServiceResult<ScheduleEntry>> {
    const schedule = await this.#getScheduleArray();
    const entry = schedule.find((e) => e.id == entryId);
    if (!entry) return this.#error("Entry not found", 404);

    if ((entry.participants || []).includes(countryId)) {
      return this.#error("Already joined", 409);
    }

    const participants = entry.participants || [];
    if (participants.length >= MAX_PARTICIPANTS) {
      return this.#error("Class is full", 409);
    }

    const sameDayJoined = schedule.some(
      (e) =>
        e.day === entry.day &&
        Array.isArray(e.participants) &&
        e.participants.includes(countryId)
    );

    if (sameDayJoined)
      return this.#error("Already joined another class for this day", 409);

    const updated: ScheduleEntry = {
      ...entry,
      participants: [...participants, countryId],
    };

    const [err, saved] = await this.repository.updateById(
      entryId,
      updated,
      "schedule"
    );
    if (err) return [err, undefined];
    return [null, saved as ScheduleEntry];
  }

  async leaveClass(
    entryId: number | string,
    countryId: string
  ): Promise<ServiceResult<ScheduleEntry>> {
    const schedule = await this.#getScheduleArray();
    const entry = schedule.find((e) => e.id == entryId);
    if (!entry) return this.#error("Entry not found", 404);

    const participants = entry.participants || [];
    if (!participants.includes(countryId)) {
      return this.#error("Not joined", 400);
    }

    const updated: ScheduleEntry = {
      ...entry,
      participants: participants.filter(
        (participant) => participant != countryId
      ),
    };

    const [err, saved] = await this.repository.updateById(
      entryId,
      updated,
      "schedule"
    );
    if (err) return [err, undefined];
    return [null, saved as ScheduleEntry];
  }

  #validatePayload(data: CreateScheduleEntryDTO | UpdateScheduleEntryDTO) {
    if (!ALLOWED_DAYS.includes(data.day)) return "Invalid day";
    if (!/^\d{2}:\d{2}$/.test(data.time)) return "Invalid time format";
    return null;
  }

  async #getScheduleArray(): Promise<ScheduleEntry[]> {
    const file = await this.repository.getAll("schedule", "none");
    return (file.schedule || []).map((entry: ScheduleEntry) => ({
      ...entry,
      participants: entry.participants || [],
    }));
  }

  async #updateExisting(
    data: UpdateScheduleEntryDTO,
    schedule: ScheduleEntry[]
  ): Promise<ServiceResult<ScheduleEntry>> {
    const entryId = data.id;
    const existing = schedule.find((e) => e.id == entryId);
    if (!existing) return this.#error("Entry not found", 404);

    const clash = schedule.find(
      (e) => e.day === data.day && e.time === data.time && e.id != entryId
    );
    if (clash) return this.#error("Day/time already used", 409);

    const updated: ScheduleEntry = {
      ...existing,
      ...data,
      id: entryId,
      participants: existing.participants || [],
    };

    const [err, saved] = await this.repository.updateById(
      entryId,
      updated,
      "schedule"
    );

    if (err) return [err, undefined];
    return [null, saved as ScheduleEntry];
  }

  async #createOrReplaceSlot(
    data: CreateScheduleEntryDTO,
    schedule: ScheduleEntry[]
  ): Promise<ServiceResult<ScheduleEntry>> {
    const existingSlot = schedule.find(
      (e) => e.day === data.day && e.time === data.time
    );
    if (existingSlot) {
      const updated: ScheduleEntry = {
        ...existingSlot,
        ...data,
        id: existingSlot.id,
        participants: existingSlot.participants || [],
      };
      const [err, saved] = await this.repository.updateById(
        updated.id,
        updated,
        "schedule"
      );

      if (err) return [err, undefined];
      return [null, saved as ScheduleEntry];
    }

    const [err, created] = await this.repository.create(
      { ...data, participants: [] },
      "schedule"
    );
    if (err) return [err, undefined];
    return [null, created as ScheduleEntry];
  }

  #error(message: string, code = 400): ServiceResult<never> {
    return [{ message, code }, undefined];
  }
}

export interface ScheduleEntry {
  id: number | string;
  day: string;
  time: string;
  classType: string;
  teacherId: string | number | null;
  participants: string[];
}

export interface CreateScheduleEntryDTO {
  day: string;
  time: string;
  classType: string;
  teacherId: string | number | null;
}

export interface UpdateScheduleEntryDTO extends CreateScheduleEntryDTO {
  id: number | string;
}

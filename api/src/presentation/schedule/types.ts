export interface ScheduleEntry {
  id: number;
  day: string;
  time: string;
  classType: string;
  teacherId: string | number | null;
}

export interface CreateScheduleEntryDTO {
  day: string;
  time: string;
  classType: string;
  teacherId: string | number | null;
}

export interface UpdateScheduleEntryDTO extends CreateScheduleEntryDTO {
  id: number;
}

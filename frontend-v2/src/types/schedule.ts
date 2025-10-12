export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type ClassType =
  | "camilla"
  | "telas"
  | "clases grupales"
  | "sala"
  | "pilates"
  | "mixta";

export interface ScheduleEntry {
  id: number | string;
  day: DayOfWeek;
  time: string;
  classType: ClassType;
  teacherId: string | number | null;
  participants: string[];
}

export interface ScheduleState {
  entries: ScheduleEntry[];
}

export const CLASS_TYPE_OPTIONS: ClassType[] = [
  "camilla",
  "telas",
  "clases grupales",
  "sala",
  "pilates",
  "mixta",
];

export const DAYS_LABEL: Record<DayOfWeek, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
};

export const DEFAULT_TIME_SLOTS: string[] = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

export const MAX_CLASS_PARTICIPANTS = 10;

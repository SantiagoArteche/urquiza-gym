import { Schema, InferSchemaType, model } from "mongoose";

const scheduleSchema = new Schema(
  {
    day: { type: String, required: true },
    time: { type: String, required: true },
    classType: { type: String, required: true },
    teacherId: { type: Schema.Types.Mixed, default: null },
    participants: { type: [String], default: [] },
  },
  { timestamps: false }
);

export type ScheduleDoc = InferSchemaType<typeof scheduleSchema>;
export const ScheduleModel = model<ScheduleDoc>(
  "Schedule",
  scheduleSchema,
  "schedule"
);

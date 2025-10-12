import { Schema, InferSchemaType, model } from "mongoose";

const scheduleSchema = new Schema(
  {
    day: { type: String, required: true },
    time: { type: String, required: true },
    classType: { type: String, required: true },
    id: { type: String, unique: true, index: true },
    teacherId: { type: Schema.Types.Mixed, default: null },
    participants: { type: [String], default: [] },
  },
  { timestamps: false }
);

scheduleSchema.pre("save", function (next) {
  if (!this.id && this._id) {
    this.id = this._id.toString();
  }
  next();
});

scheduleSchema.pre("insertMany", function (next, docs: any[]) {
  if (!Array.isArray(docs)) return next();
  for (const doc of docs) {
    if (!doc.id && doc._id) {
      doc.id = doc._id.toString();
    }
  }
  next();
});

export type ScheduleDoc = InferSchemaType<typeof scheduleSchema>;
export const ScheduleModel = model<ScheduleDoc>(
  "Schedule",
  scheduleSchema,
  "schedule"
);

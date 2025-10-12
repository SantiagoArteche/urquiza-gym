import { InferSchemaType, model, Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    name: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    countryId: { type: String, default: "" },
    emergencyPhone: { type: String, default: "" },
    assignedClasses: { type: [String], default: [] },
  },
  { timestamps: false }
);

export type TeacherDoc = InferSchemaType<typeof teacherSchema>;
export const TeacherModel = model<TeacherDoc>(
  "Teacher",
  teacherSchema,
  "teachers"
);

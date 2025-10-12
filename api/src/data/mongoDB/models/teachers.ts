import { InferSchemaType, model, Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    id: { type: String, unique: true, index: true },
    name: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    countryId: { type: String, default: "" },
    emergencyPhone: { type: String, default: "" },
    assignedClasses: { type: [String], default: [] },
  },
  { timestamps: false }
);

teacherSchema.pre("save", function (next) {
  if (!this.id && this._id) {
    this.id = this._id.toString();
  }
  next();
});

teacherSchema.pre("insertMany", function (next, docs: any[]) {
  if (!Array.isArray(docs)) return next();
  for (const doc of docs) {
    if (!doc.id && doc._id) {
      doc.id = doc._id.toString();
    }
  }
  next();
});
export type TeacherDoc = InferSchemaType<typeof teacherSchema>;
export const TeacherModel = model<TeacherDoc>(
  "Teacher",
  teacherSchema,
  "teachers"
);

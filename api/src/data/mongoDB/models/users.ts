import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: String, unique: true, index: true },
    name: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    countryId: { type: String, default: "" },
    emergencyPhone: { type: String, default: "" },
    expirement: { type: String, default: "" },
    debtType: { type: String, default: "" },
  },
  { timestamps: false }
);

userSchema.pre("save", function (next) {
  if (!this.id && this._id) {
    this.id = this._id.toString();
  }
  next();
});

userSchema.pre("insertMany", function (next, docs: any[]) {
  if (!Array.isArray(docs)) return next();
  for (const doc of docs) {
    if (!doc.id && doc._id) {
      doc.id = doc._id.toString();
    }
  }
  next();
});

export type UserDoc = InferSchemaType<typeof userSchema>;
export const UserModel = model<UserDoc>("User", userSchema, "users");

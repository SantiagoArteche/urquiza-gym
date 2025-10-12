import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
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


export type UserDoc = InferSchemaType<typeof userSchema>;
export const UserModel = model<UserDoc>("User", userSchema, "users");

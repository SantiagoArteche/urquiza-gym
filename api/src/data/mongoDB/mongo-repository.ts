import mongoose, { Types, isValidObjectId } from "mongoose";
import { IRepository } from "../repository";
import { ScheduleModel } from "./models/schedule";
import { UserModel } from "./models/users";
import { TeacherModel } from "./models/teachers";

type EntityKey = "users" | "teachers" | "schedule";
export class MongoRepository implements IRepository {
  #modelFor(
    entityKey: EntityKey
  ): typeof UserModel | typeof TeacherModel | typeof ScheduleModel {
    switch (entityKey) {
      case "users":
        return UserModel;
      case "teachers":
        return TeacherModel;
      case "schedule":
        return ScheduleModel;
      default:
        throw new Error("Unknown entity key");
    }
  }

  async getAll(
    entityKey: EntityKey,
    key: string,
    search?: string,
    limit?: number,
    offset?: number
  ) {
    const Model: any = this.#modelFor(entityKey);

    const filter: any = {};
    if (search && key) {
      if (
        key === "fullName" ||
        key === "fullNameOrCountryId" ||
        key === "fullNameAndCountryId"
      ) {
        filter.$or = [
          { name: new RegExp(search, "i") },
          { lastName: new RegExp(search, "i") },
        ];
        if (key === "fullNameOrCountryId" || key === "fullNameAndCountryId") {
          filter.$or.push({ countryId: new RegExp(search, "i") });
        }
      } else {
        filter[key] = new RegExp(search, "i");
      }
    }

    const query = Model.find(filter).sort({ _id: 1 }).lean();
    if (typeof offset === "number") query.skip(offset);
    if (typeof limit === "number") query.limit(limit);

    const docs = await query.exec();
    return { [entityKey]: docs } as any;
  }

  async getById(id: number | string, entityKey?: EntityKey) {
    if (!entityKey) return [{ message: "Missing key", code: 400 }];
    const Model: any = this.#modelFor(entityKey);
    if (typeof id !== "string" || !isValidObjectId(id)) {
      return [{ message: "Invalid id", code: 400 }];
    }
    const filter: any = { _id: new Types.ObjectId(id) };
    const doc = await Model.findOne(filter).lean();
    if (!doc) return [{ message: "Entity not found", code: 404 }];
    return [null, { ...doc, id: String(doc._id) }];
  }

  async getByCountryId(countryId: string, entityKey?: EntityKey) {
    if (!entityKey) return [{ message: "Missing key", code: 400 }];
    if (entityKey === "schedule")
      return [{ message: "Unsupported search for schedule", code: 400 }];
    const Model: any = this.#modelFor(entityKey);
    const doc = await Model.findOne({ countryId }).lean();
    if (!doc) return [{ message: "User not found", code: 404 }];
    return [null, { ...doc, id: String(doc._id) }];
  }

  async deleteById(id: number | string, entityKey?: EntityKey) {
    if (!entityKey) return [{ message: "Missing key", code: 400 }];
    const Model: any = this.#modelFor(entityKey);
    if (typeof id !== "string" || !isValidObjectId(id)) {
      return [{ message: "Invalid id", code: 400 }];
    }
    const filter: any = { _id: new Types.ObjectId(id) };
    const res = await Model.deleteOne(filter);
    if (res.deletedCount === 0)
      return [{ message: "Entity not found", code: 404 }];
    return [null, true];
  }

  async create(data: any, entityKey?: EntityKey, uniqueKey?: string) {
    if (!entityKey) return [{ message: "Missing key", code: 400 }];
    const Model: any = this.#modelFor(entityKey);

    const toInsert = { ...data };

    if (uniqueKey) {
      const exists = await Model.findOne({ [uniqueKey]: toInsert[uniqueKey] })
        .select({ _id: 1 })
        .lean();
      if (exists) {
        return [
          {
            message: "Unique key already exists",
            uniqueKey: toInsert[uniqueKey],
            code: 409,
          },
        ];
      }
    }

    const created = await Model.create(toInsert);
    const obj = created.toObject();
    return [null, { ...obj, id: String(obj._id) }];
  }

  async updateById(id: number | string, data: object, entityKey?: EntityKey) {
    if (!entityKey) return [{ message: "Missing key", code: 400 }];
    const Model: any = this.#modelFor(entityKey);
    if (typeof id !== "string" || !isValidObjectId(id)) {
      return [{ message: "Invalid id", code: 400 }];
    }
    const filter: any = { _id: new Types.ObjectId(id) };
    const found = await Model.findOne(filter).select({ _id: 1 }).lean();
    if (!found) return [{ message: "Entity not found", code: 404 }];
    await Model.updateOne(filter, { $set: { ...data } });
    const updated = await Model.findOne(filter).lean();
    return [null, updated ? { ...updated, id: String(updated._id) } : updated];
  }

  static connect() {
    return mongoose
      .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.eeaiizx.mongodb.net/${process.env.MONGO_DB}`
      )
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB", err);
      });
  }
}

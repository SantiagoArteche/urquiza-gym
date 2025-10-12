import mongoose from "mongoose";
import { IRepository } from "../repository";

export class MongoRepository implements IRepository {
  getAll() {}
  getById() {}
  getByCountryId() {}
  deleteById() {}
  create() {}
  updateById() {}

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

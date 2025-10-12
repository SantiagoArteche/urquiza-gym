import { LocalRepository } from "./localDB/local-repository";
import "dotenv/config";
import { MongoRepository } from "./mongoDB/mongo-repository";

type entity = "users" | "teachers" | "schedule";

export interface IRepository {
  getAll: (
    entityKey: entity,
    key: string,
    search?: string,
    limit?: number,
    offset?: number
  ) => any;
  getById: (id: number | string, entityKey?: entity) => any;
  getByCountryId: (countryId: string, entityKey?: entity) => any;
  deleteById: (id: number | string, entityKey?: entity) => any;
  create: (data: any, entityKey?: entity, uniqueKey?: string) => any;
  updateById: (id: number | string, data: object, entityKey?: entity) => any;
}

export const repository =
  process.env.ENVIRONMENT === "production"
    ? new MongoRepository()
    : new LocalRepository();

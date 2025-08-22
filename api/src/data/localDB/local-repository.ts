import fs from "fs";
import { IRepository } from "../repository";
import path from "path";

const dbPath = path.join(__dirname, "database.json");
export class LocalRepository implements IRepository {
  getAll(search?: string, limit?: number, offset?: number) {
    const fileContent = fs.readFileSync(dbPath, "utf8");

    return JSON.parse(fileContent);
  }

  getById(id: number, entityKey?: string) {
    if (!entityKey) return ["Missing key"];

    const file = this.getAll();

    const entities = file[entityKey];

    if (!entities.length) return ["The searched property must be an array"];

    const foundEntity = entities.find((entity: any) => entity.id === id);

    if (!foundEntity) return ["User not found"];

    return [null, foundEntity];
  }

  deleteById(id: number, entityKey?: string) {
    if (!entityKey) return ["Missing key"];

    const file = this.getAll();

    const entities = file[entityKey];

    if (!entities.length) return ["The searched property must be an array"];

    const newEntities = entities.filter((entity: any) => entity.id !== id);

    if (newEntities.length === entities.length) return ["User not found"];

    file[entityKey] = newEntities;

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return [null, true];
  }

  createId(entities: any[]) {
    if (!entities.length) return 1;

    entities.sort((a: any, b: any) => a.id - b.id);

    const lastIndex = entities.length - 1;
    return entities[lastIndex].id + 1;
  }

  create(data: any, entityKey?: string) {
    if (!entityKey) return { error: "Missing key" };

    const file = this.getAll();

    const entities = file[entityKey];
    if (!entities.length)
      return { error: "The searched property must be an array" };

    const id = this.createId(entities);

    const newEntity = { ...data, id };
    file[entityKey] = [...entities, newEntity];

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return newEntity;
  }
}

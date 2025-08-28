import fs from "fs";
import { IRepository } from "../repository";
import path from "path";

const dbPath = path.join(__dirname, "database.json");
export class LocalRepository implements IRepository {
  #getFile() {
    const fileContent = fs.readFileSync(dbPath, "utf8");

    return JSON.parse(fileContent);
  }

  getAll(
    entityKey: string,
    key: string,
    search?: string,
    limit?: number,
    offset?: number
  ) {
    const file = this.#getFile();

    if (search) {
      file[entityKey] = this.#filterEntitiesBySearch(
        file,
        entityKey,
        key,
        search
      );
    }

    return file;
  }

  #filterEntitiesBySearch(
    file: any,
    entityKey: string,
    key: string,
    search: string
  ) {
    return file[entityKey].filter((entity: any) => {
      if (key === "fullName" || "fullNameOrCountryId") {
        return this.#specialFilters(entity, key, search);
      }

      return entity[key].startsWith(search) || entity[key].endsWith(search);
    });
  }

  #specialFilters(entity: any, key: string, search: string) {
    if (key === "fullName") {
      return this.#getEntityByFullName(entity, search);
    }

    const countryId = entity.countryId.toLowerCase().trim();
    return (
      this.#getEntityByFullName(entity, search) ||
      countryId.startsWith(search.toLowerCase())
    );
  }

  #getEntityByFullName(entity: any, search: string) {
    const name = entity.name.toLowerCase().trim();
    const lastName = entity.lastName.toLowerCase().trim();

    return (
      name.startsWith(search.toLowerCase()) ||
      name.endsWith(search.toLowerCase()) ||
      lastName.startsWith(search.toLowerCase()) ||
      lastName.endsWith(search.toLowerCase())
    );
  }

  getById(id: number, entityKey?: string) {
    if (!entityKey) return ["Missing key"];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length) return ["The searched property must be an array"];

    const foundEntity = entities.find((entity: any) => entity.id === id);

    if (!foundEntity) return ["User not found"];

    return [null, foundEntity];
  }

  getByCountryId(countryId: string, key?: string) {
    if (!key) return ["Missing key"];

    const file = this.#getFile();

    const entities = file[key];

    if (!entities.length) return ["The searched property must be an array"];

    const foundEntity = entities.find(
      (entity: any) => entity.countryId === countryId
    );

    if (!foundEntity) return ["User not found"];

    return [null, foundEntity];
  }

  deleteById(id: number, entityKey?: string) {
    if (!entityKey) return ["Missing key"];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length) return ["The searched property must be an array"];

    const newEntities = entities.filter((entity: any) => entity.id !== id);

    if (newEntities.length === entities.length) return ["Entity not found"];

    file[entityKey] = newEntities;

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return [null, true];
  }

  updateById(id: number, data: object, entityKey?: string) {
    if (!entityKey) return ["Missing key"];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length) return ["The searched property must be an array"];

    const foundEntity = entities.find((entity: any) => entity.id === id);

    if (!foundEntity) return ["Entity not found"];

    file[entityKey] = this.#updateUser(file, entityKey, data, id);

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return [null, data];
  }

  #updateUser(file: any, entityKey: string, data: object, userId: number) {
    return file[entityKey].map((entity: any) => {
      if (entity.id === userId) {
        entity = { ...data, id: userId };
      }

      return entity;
    });
  }

  buildId(entities: any[]) {
    if (!entities.length) return 1;

    entities.sort((a: any, b: any) => a.id - b.id);

    const lastIndex = entities.length - 1;
    return entities[lastIndex].id + 1;
  }

  create(data: any, key?: string, uniqueKey?: string) {
    if (!key) return { error: "Missing key" };

    const file = this.#getFile();

    const entities = file[key];

    if (!Array.isArray(entities))
      return { error: "The searched property must be an array" };

    const id = this.buildId(entities);

    const newEntity = { ...data, id };

    if (uniqueKey) {
      const hasRepeatedCountryId = entities.find(
        (entity: any) => entity[uniqueKey] === newEntity[uniqueKey]
      );

      if (hasRepeatedCountryId) {
        return {
          error: `Unique key already exists`,
          uniqueKey: newEntity[uniqueKey],
        };
      }
    }

    file[key] = [...entities, newEntity];

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return newEntity;
  }
}

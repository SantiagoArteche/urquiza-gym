import fs from "fs";
import type { IRepository } from "../repository";
import path from "path";

const dbPath = path.join(__dirname, "database.json");
export class LocalRepository implements IRepository {
  #getFile() {
    const fileContent = fs.readFileSync(dbPath, "utf8");

    return JSON.parse(fileContent);
  }

  getAll(
    entityKey: "users" | "teachers",
    key: string,
    search?: string,
    limit?: number,
    offset?: number
  ) {
    const file = this.#getFile();
    let collection = file[entityKey] || [];

    if (search) {
      collection = this.#filterEntitiesBySearch(file, entityKey, key, search);
    }

    if (typeof offset === "number" && typeof limit === "number") {
      collection = collection.slice(offset, offset + limit);
    }

    return { [entityKey]: collection };
  }

  #filterEntitiesBySearch(
    file: any,
    entityKey: string,
    key: string,
    search: string
  ) {
    return (file[entityKey] || []).filter((entity: any) => {
      if (
        key === "fullName" ||
        key === "fullNameOrCountryId" ||
        key === "fullNameAndCountryId"
      ) {
        return this.#specialFilters(entity, key, search);
      }
      const value = (entity[key] || "").toString().toLowerCase();
      const term = search.toLowerCase();
      return value.startsWith(term) || value.endsWith(term);
    });
  }

  #specialFilters(entity: any, key: string, search: string) {
    const term = search.toLowerCase();
    if (key === "fullName") {
      return this.#getEntityByFullName(entity, term);
    }
    const countryId = (entity.countryId || "").toLowerCase().trim();
    return (
      this.#getEntityByFullName(entity, term) || countryId.startsWith(term)
    );
  }

  #getEntityByFullName(entity: any, search: string) {
    const name = (entity.name || "").toLowerCase().trim();
    const lastName = (entity.lastName || "").toLowerCase().trim();
    const term = search.toLowerCase().trim();

    return (
      name.startsWith(term) ||
      name.endsWith(term) ||
      lastName.startsWith(term) ||
      lastName.endsWith(term)
    );
  }

  getById(id: number, entityKey?: "users" | "teachers") {
    if (!entityKey) return ["Missing key"];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length) return ["The searched property must be an array"];

    const foundEntity = entities.find((entity: any) => entity.id === id);

    if (!foundEntity) return ["User not found"];

    return [null, foundEntity];
  }

  getByCountryId(countryId: string, key?: "users" | "teachers") {
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

  deleteById(id: number, entityKey?: "users" | "teachers") {
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

  updateById(id: number, data: object, entityKey?: "users" | "teachers") {
    if (!entityKey) return ["Missing key"];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length) return ["The searched property must be an array"];

    const foundEntity = entities.find((entity: any) => entity.id === id);

    if (!foundEntity) return ["Entity not found"];

    file[entityKey] = this.#updateEntity(file, entityKey, data, id);

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return [null, data];
  }

  #updateEntity(file: any, entityKey: string, data: object, entityId: number) {
    return file[entityKey].map((entity: any) => {
      if (entity.id === entityId) {
        entity = { ...data, id: entityId };
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

  create(data: any, key?: "users" | "teachers", uniqueKey?: string) {
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

import fs from "fs";
import type { IRepository } from "../repository";

type EntityKey = "users" | "teachers" | "schedule";
import path from "path";

const dbPath = path.join(__dirname, "database.json");
export class LocalRepository implements IRepository {
  #getFile() {
    const fileContent = fs.readFileSync(dbPath, "utf8");

    return JSON.parse(fileContent);
  }

  getAll(
    entityKey: EntityKey,
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

  getById(id: number | string, entityKey?: EntityKey) {
    if (!entityKey) return [{ message: "Missing key", code: 400 }];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length)
      return [{ message: "The searched property must be an array", code: 400 }];

    const targetId = typeof id === "string" ? Number(id) : id;
    const foundEntity = entities.find((entity: any) => entity.id === targetId);

    if (!foundEntity) return [{ message: "Entity not found", code: 404 }];

    return [null, foundEntity];
  }

  getByCountryId(countryId: string, key?: EntityKey) {
    if (!key) return [{ message: "Missing key", code: 400 }];
    if (key === "schedule")
      return [{ message: "Unsupported search for schedule", code: 400 }];

    const file = this.#getFile();

    const entities = file[key];

    if (!entities.length)
      return [{ message: "The searched property must be an array", code: 400 }];

    const foundEntity = entities.find(
      (entity: any) => entity.countryId === countryId
    );

    if (!foundEntity) return [{ message: "User not found", code: 404 }];

    return [null, foundEntity];
  }

  deleteById(id: number | string, entityKey?: EntityKey) {
    if (!entityKey) return [{ message: "Missing key", code: 400 }];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length)
      return [{ message: "The searched property must be an array", code: 400 }];

    const targetId = typeof id === "string" ? Number(id) : id;
    const newEntities = entities.filter(
      (entity: any) => entity.id !== targetId
    );

    if (newEntities.length === entities.length)
      return [{ message: "Entity not found", code: 404 }];

    file[entityKey] = newEntities;

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return [null, true];
  }

  updateById(id: number | string, data: object, entityKey?: EntityKey) {
    if (!entityKey) return ["Missing key"];

    const file = this.#getFile();

    const entities = file[entityKey];

    if (!entities.length)
      return [{ message: "The searched property must be an array", code: 400 }];

    const targetId = typeof id === "string" ? Number(id) : id;
    const foundEntity = entities.find((entity: any) => entity.id === targetId);

    if (!foundEntity) return [{ message: "Entity not found", code: 404 }];

    file[entityKey] = this.#updateEntity(file, entityKey, data, targetId);

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return [null, data];
  }

  #updateEntity(
    file: any,
    entityKey: string,
    data: object,
    entityId: number | string
  ) {
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

  create(data: any, key?: EntityKey, uniqueKey?: string) {
    if (!key) return { error: "Missing key" };

    const file = this.#getFile();

    const entities = file[key];

    if (!Array.isArray(entities))
      return [{ message: "The searched property must be an array", code: 400 }];

    const id = this.buildId(entities);

    const newEntity = { ...data, id };

    if (uniqueKey) {
      const hasRepeatedCountryId = entities.find(
        (entity: any) => entity[uniqueKey] === newEntity[uniqueKey]
      );

      if (hasRepeatedCountryId) {
        return [
          {
            message: "Unique key already exists",
            uniqueKey: newEntity[uniqueKey],
            code: 409,
          },
        ];
      }
    }

    file[key] = [...entities, newEntity];

    fs.writeFileSync(dbPath, JSON.stringify(file));

    return [null, newEntity];
  }
}

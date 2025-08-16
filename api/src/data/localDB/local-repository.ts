import fs from "fs";
import { IRepository } from "../repository";
import path from "path";

const dbPath = path.join(__dirname, "database.json");
export class LocalRepository implements IRepository {
  constructor() {}

  getAll(search?: string, limit?: number, offset?: number) {
    const fileContent = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(fileContent);
  }

  getById(id: number) {}

  deleteById(id: number) {}

  createId(users: any) {
    if (!users.length) return 1;

    users.sort((a: any, b: any) => a.id - b.id);

    return users.at(-1).id + 1;
  }

  create(data: any) {
    const { users } = this.getAll();
    const id = this.createId(users);
    const newUser = { ...data, id };
    fs.writeFileSync(dbPath, JSON.stringify({ users: [...users, newUser] }));

    return newUser;
  }
}

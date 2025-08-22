import { IRepository } from "../../data/repository";
import { User } from "./types";

export class UserService {
  constructor(private readonly repository: IRepository) {}

  getUsers(): User[] {
    const file = this.repository.getAll();
    return file.users;
  }

  createUser(data: User) {
    return this.repository.create(data, "users");
  }

  getUserById(id: number) {
    return this.repository.getById(id, "users");
  }

  deleteUser(id: number) {
    return this.repository.deleteById(id, "users");
  }
}

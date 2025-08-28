import { IRepository } from "../../data/repository";
import { User } from "./types";

export class UserService {
  constructor(private readonly repository: IRepository) {}

  getUsers(search: string): User[] {
    const file = this.repository.getAll(
      "users",
      "fullNameAndCountryId",
      search
    );
    return file.users;
  }

  createUser(data: User) {
    return this.repository.create(data, "users", "countryId");
  }

  getUserById(id: number) {
    return this.repository.getById(id, "users");
  }

  getUserByCountryId(countryId: string) {
    return this.repository.getByCountryId(countryId, "users");
  }

  deleteUser(id: number) {
    return this.repository.deleteById(id, "users");
  }
}

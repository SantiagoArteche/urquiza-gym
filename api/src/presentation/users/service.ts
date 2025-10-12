import { IRepository } from "../../data/repository";
import { User } from "./types";
import "dotenv/config";

export class UserService {
  constructor(private readonly repository: IRepository) {}

  async getUsers(search: string): Promise<User[]> {
    const data = await this.repository.getAll(
      "users",
      "fullNameAndCountryId",
      search
    );

    return data.users;
  }

  createUser(data: User) {
    return this.repository.create(data, "users", "countryId");
  }

  getUserById(id: number | string) {
    return this.repository.getById(id, "users");
  }

  getUserByCountryId(countryId: string) {
    return this.repository.getByCountryId(countryId, "users");
  }

  updateUserById(id: number | string, data: object) {
    return this.repository.updateById(id, data, "users");
  }

  deleteUser(id: number | string) {
    return this.repository.deleteById(id, "users");
  }
}

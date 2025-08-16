import { IRepository } from "../../data/repository";

export class UserService {
  constructor(private readonly repository: IRepository) {}

  getUsers() {
    return this.repository.getAll();
  }

  createUser(data: any) {
    return this.repository.create(data);
  }
}

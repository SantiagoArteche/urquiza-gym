import { IRepository } from "../../data/repository";
import { Teacher } from "./types";

export class TeacherService {
  constructor(private readonly repository: IRepository) {}

  async getTeachers(search: string): Promise<Teacher[]> {
    const file = await this.repository.getAll(
      "teachers",
      "fullNameAndCountryId",
      search
    );
    return file.teachers || [];
  }

  createTeacher(data: Teacher) {
    return this.repository.create(data, "teachers", "countryId");
  }

  getTeacherById(id: number | string) {
    return this.repository.getById(id, "teachers");
  }

  getTeacherByCountryId(countryId: string) {
    return this.repository.getByCountryId(countryId, "teachers");
  }

  updateTeacherById(id: number | string, data: object) {
    return this.repository.updateById(id, data, "teachers", "countryId");
  }

  deleteTeacher(id: number | string) {
    return this.repository.deleteById(id, "teachers");
  }
}

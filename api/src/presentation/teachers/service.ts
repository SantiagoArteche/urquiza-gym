import { IRepository } from "../../data/repository";
import { Teacher } from "./types";

export class TeacherService {
  constructor(private readonly repository: IRepository) {}

  getTeachers(search: string): Teacher[] {
    const file = this.repository.getAll(
      "teachers",
      "fullNameAndCountryId",
      search
    );
    return file.teachers || [];
  }

  createTeacher(data: Teacher) {
    return this.repository.create(data, "teachers", "countryId");
  }

  getTeacherById(id: number) {
    return this.repository.getById(id, "teachers");
  }

  getTeacherByCountryId(countryId: string) {
    return this.repository.getByCountryId(countryId, "teachers");
  }

  updateTeacherById(id: number, data: object) {
    return this.repository.updateById(id, data, "teachers");
  }

  deleteTeacher(id: number) {
    return this.repository.deleteById(id, "teachers");
  }
}

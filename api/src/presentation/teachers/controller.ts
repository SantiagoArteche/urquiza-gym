import { Request, Response } from "express";
import { TeacherService } from "./service";

export class TeacherController {
  constructor(private readonly service: TeacherService) {}

  getTeachers = (req: Request, res: Response) => {
    const { search } = req.query;
    const teachers = this.service.getTeachers((search as string) || "");
    return res.json({ teachers });
  };

  getTeacherById = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, foundTeacher] = this.service.getTeacherById(id);
    if (error) return res.status(error.code).json({ message: error.message });
    return res.json(foundTeacher);
  };

  getTeacherByCountryId = (req: Request, res: Response) => {
    const { countryId } = req.params;
    const [error, foundTeacher] = this.service.getTeacherByCountryId(countryId);
    if (error) return res.status(error.code).json({ message: error.message });
    return res.json(foundTeacher);
  };

  createTeacher = async (req: Request, res: Response) => {
    const {
      name,
      lastName,
      phone,
      countryId,
      emergencyPhone,
      assignedClasses,
    } = req.body;

    const data = {
      name,
      lastName,
      phone,
      countryId,
      emergencyPhone,
      assignedClasses,
    };

    const [error, newTeacher] = await this.service.createTeacher(data);

    if (error) {
      return res.status(error.code).json({
        success: false,
        error: error.message,
        uniqueKey: error.uniqueKey,
      });
    }

    return res.status(201).json({ success: true, teacher: newTeacher });
  };

  updateTeacherById = (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      name,
      lastName,
      phone,
      countryId,
      emergencyPhone,
      assignedClasses,
    } = req.body;

    const data = {
      name,
      lastName,
      phone,
      countryId,
      emergencyPhone,
      assignedClasses,
    };

    const [error, updatedTeacher] = this.service.updateTeacherById(id, data);
    if (error) return res.status(error.code).json({ message: error.message });
    return res.json(updatedTeacher);
  };

  deleteTeacher = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error] = this.service.deleteTeacher(id);
    if (error) return res.status(error.code).json({ message: error.message });
    return res.json({ message: `The teacher with the id ${id} was deleted` });
  };
}

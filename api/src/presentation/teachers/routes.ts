import { Router } from "express";
import { TeacherService } from "./service";
import { TeacherController } from "./controller";
import { repository } from "../../data/repository";

export class TeacherRoutes {
  static get router() {
    const router = Router();

    const service = new TeacherService(repository);
    const controller = new TeacherController(service);

    router.get("/", controller.getTeachers);
    router.get("/:id", controller.getTeacherById);
    router.get("/country-id/:countryId", controller.getTeacherByCountryId);
    router.post("/", controller.createTeacher);
    router.put("/:id", controller.updateTeacherById);
    router.delete("/:id", controller.deleteTeacher);

    return router;
  }
}

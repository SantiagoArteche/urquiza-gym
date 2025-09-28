import { Router } from "express";
import { TeacherService } from "./service";
import { LocalRepository } from "../../data/localDB/local-repository";
import { TeacherController } from "./controller";

export class TeacherRoutes {
  static get router() {
    const router = Router();

    const repository = new LocalRepository();
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

import { Router } from "express";
import { ScheduleController } from "./controller";
import { ScheduleService } from "./service";
import { repository } from "../../data/repository";

export class ScheduleRoutes {
  static get router() {
    const router = Router();

    const service = new ScheduleService(repository);
    const controller = new ScheduleController(service);

    router.get("/", controller.getSchedule);
    router.post("/", controller.upsert);
    router.put("/", controller.upsert);
    router.post("/:id/join", controller.join);
    router.post("/:id/leave", controller.leave);
    router.delete("/:id", controller.delete);

    return router;
  }
}

import { Router } from "express";
import { ScheduleController } from "./controller";
import { ScheduleService } from "./service";
import { LocalRepository } from "../../data/localDB/local-repository";

export class ScheduleRoutes {
  static get router() {
    const router = Router();
    const repository = new LocalRepository();
    const service = new ScheduleService(repository);
    const controller = new ScheduleController(service);

    router.get("/", controller.getSchedule);
    router.post("/", controller.upsert);
    router.put("/", controller.upsert);
    router.post("/:id/join", controller.join);
    router.delete("/:id", controller.delete);

    return router;
  }
}

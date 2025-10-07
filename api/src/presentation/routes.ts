import { Router } from "express";
import { UserRoutes } from "./users/routes";
import { TeacherRoutes } from "./teachers/routes";
import { ScheduleRoutes } from "./schedule/routes";

export class Routes {
  static get router() {
    const router = Router();

    router.use("/api/users", UserRoutes.router);
    router.use("/api/teachers", TeacherRoutes.router);
    router.use("/api/schedule", ScheduleRoutes.router);

    return router;
  }
}

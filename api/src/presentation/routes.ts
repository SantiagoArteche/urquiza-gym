import { Router } from "express";
import { UserRoutes } from "./users/routes";

export class Routes {
  static get router() {
    const router = Router();

    router.use("/api/users", UserRoutes.router);
    return router;
  }
}

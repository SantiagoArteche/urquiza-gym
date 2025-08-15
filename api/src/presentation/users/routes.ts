import { Request, Response, Router } from "express";

export class UserRoutes {
  static get router() {
    const router = Router();

    router.get("/", (req: Request, res: Response) => res.json("hola"));

    return router;
  }
}

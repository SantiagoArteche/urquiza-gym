import { Router } from "express";
import { UserService } from "./service";
import { LocalRepository } from "../../data/localDB/local-repository";
import { UserController } from "./controller";

export class UserRoutes {
  static get router() {
    const router = Router();

    const repository = new LocalRepository();
    const service = new UserService(repository);
    const controller = new UserController(service);

    router.get("/", controller.getUsers);
    router.get("/:id", controller.getUserById);
    router.get("/country-id/:countryId", controller.getUserByCountryId);
    router.post("/", controller.createUser);
    router.put("/:id", controller.updateUserById);
    router.delete("/:id", controller.deleteUser);

    return router;
  }
}

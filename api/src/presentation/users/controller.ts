import { Request, Response } from "express";
import { UserService } from "./service";

export class UserController {
  constructor(private readonly service: UserService) {}

  getUsers = (req: Request, res: Response) => {
    const { users } = this.service.getUsers();

    return res.json({ users });
  };

  createUser = (req: Request, res: Response) => {
    const { name, lastName, dni, phone, emergencyPhone, expirement, debtType } =
      req.body;

    const data = {
      name,
      lastName,
      dni,
      phone,
      emergencyPhone,
      expirement,
      debtType,
    };
    const users = this.service.createUser(data);

    return res.json({ users });
  };
}

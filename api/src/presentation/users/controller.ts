import { Request, Response } from "express";
import { UserService } from "./service";

export class UserController {
  constructor(private readonly service: UserService) {}

  getUsers = (req: Request, res: Response) => {
    const users = this.service.getUsers();

    return res.json({ users });
  };

  getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(+id))
      return res.status(400).json({ message: "The id must be a number" });

    const [error, foundUser] = this.service.getUserById(+id);

    if (error) return res.json({ message: error });

    return res.json(foundUser);
  };

  createUser = (req: Request, res: Response) => {
    const {
      name,
      lastName,
      dni,
      phone,
      countryId,
      emergencyPhone,
      expirement,
      debtType,
    } = req.body;

    const data = {
      name,
      lastName,
      dni,
      phone,
      countryId,
      emergencyPhone,
      expirement,
      debtType,
    };

    const users = this.service.createUser(data);

    return res.json({ users });
  };

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(+id))
      return res.status(400).json({ message: "The id must be a number" });

    const [error] = this.service.deleteUser(+id);

    if (error) return res.json({ message: error });

    return res.json({ message: `The user with the id ${id} was deleted` });
  };
}

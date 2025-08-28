import { Request, Response } from "express";
import { UserService } from "./service";

export class UserController {
  constructor(private readonly service: UserService) {}

  getUsers = (req: Request, res: Response) => {
    const { search } = req.query;

    const users = this.service.getUsers(search as string);

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

  getUserByCountryId = (req: Request, res: Response) => {
    const { countryId } = req.params;

    const [error, foundUser] = this.service.getUserByCountryId(countryId);

    if (error) return res.json({ message: error });

    return res.json(foundUser);
  };

  createUser = async (req: Request, res: Response) => {
    const {
      name,
      lastName,
      phone,
      countryId,
      emergencyPhone,
      expirement,
      debtType,
    } = req.body;

    const data = {
      name,
      lastName,
      phone,
      countryId,
      emergencyPhone,
      expirement,
      debtType,
    };

    const newUser = await this.service.createUser(data);

    if (newUser.error) {
      return res.status(400).json({
        success: false,
        error: newUser.error,
        uniqueKey: newUser.uniqueKey,
      });
    }

    return res.status(201).json({ success: true, user: newUser });
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

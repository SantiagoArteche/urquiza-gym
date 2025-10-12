import { Request, Response } from "express";
import { UserService } from "./service";

export class UserController {
  constructor(private readonly service: UserService) {}

  getUsers = async (req: Request, res: Response) => {
    const { search } = req.query;

    const users = await this.service.getUsers(search as string);

    return res.json({ users });
  };

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, foundUser] = await this.service.getUserById(id);

    if (error) return res.status(error.code).json({ message: error.message });

    return res.json(foundUser);
  };

  getUserByCountryId = async (req: Request, res: Response) => {
    const { countryId } = req.params;

    const [error, foundUser] = await this.service.getUserByCountryId(countryId);

    if (error) return res.status(error.code).json({ message: error.message });

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

    const [error, newUser] = await this.service.createUser(data);

    if (error) {
      return res.status(error.code).json({
        success: false,
        error: error.message,
        uniqueKey: error.uniqueKey,
      });
    }

    return res.status(201).json({ success: true, user: newUser });
  };

  updateUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
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
    const [error, updatedUser] = await this.service.updateUserById(id, data);

    if (error) return res.status(error.code).json({ message: error.message });

    return res.json(updatedUser);
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error] = await this.service.deleteUser(id);

    if (error) return res.status(error.code).json({ message: error.message });

    return res.json({ message: `The user with the id ${id} was deleted` });
  };
}

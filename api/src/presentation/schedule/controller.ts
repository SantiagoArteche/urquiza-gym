import { Request, Response } from "express";
import { ScheduleService } from "./service";

export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  getSchedule = (_req: Request, res: Response) => {
    const schedule = this.service.getSchedule();
    res.json({ schedule });
  };

  upsert = (req: Request, res: Response) => {
    const body = req.body;
    const [error, entry] = this.service.upsertEntry(body);
    if (error) {
      return res.status(error.code).json({ error: error.message });
    }

    res.json(entry);
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    if (Number.isNaN(+id)) return res.status(400).json({ error: "Invalid id" });

    const [error] = this.service.deleteEntry(+id);

    if (error) return res.status(error.code).json({ message: error.message });

    res.json({ message: `The schedule entry with the id ${id} was deleted` });
  };
}

import { Request, Response } from "express";
import { ScheduleService } from "./service";

export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  getSchedule = async (_req: Request, res: Response) => {
    const [error, schedule] = await this.service.getSchedule();
    if (error) {
      return res
        .status(error.code ?? 500)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ schedule: schedule ?? [] });
  };

  upsert = async (req: Request, res: Response) => {
    const body = req.body;
    const [error, entry] = await this.service.upsertEntry(body);

    if (error) {
      return res
        .status(error.code ?? 400)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ entry });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const [error] = await this.service.deleteEntry(id);

    if (error)
      return res
        .status(error.code ?? 400)
        .json({ message: error.message ?? "Unexpected error" });

    res.json({ message: `The schedule entry with the id ${id} was deleted` });
  };

  join = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { countryId } = req.body || {};

    if (!countryId) return res.status(400).json({ error: "Missing countryId" });

    const [error, entry] = await this.service.joinClass(id, countryId);
    if (error) {
      return res
        .status(error.code ?? 400)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ entry });
  };

  leave = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { countryId } = req.body || {};

    if (!countryId) return res.status(400).json({ error: "Missing countryId" });

    const [error, entry] = await this.service.leaveClass(id, String(countryId));
    if (error) {
      return res
        .status(error.code ?? 400)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ entry });
  };
}

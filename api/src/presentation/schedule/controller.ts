import { Request, Response } from "express";
import { ScheduleService } from "./service";

export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  getSchedule = (_req: Request, res: Response) => {
    const [error, schedule] = this.service.getSchedule();
    if (error) {
      return res
        .status(error.code ?? 500)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ schedule: schedule ?? [] });
  };

  upsert = (req: Request, res: Response) => {
    const body = req.body;
    const [error, entry] = this.service.upsertEntry(body);

    if (error) {
      return res
        .status(error.code ?? 400)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ entry });
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    if (Number.isNaN(+id)) return res.status(400).json({ error: "Invalid id" });

    const [error] = this.service.deleteEntry(+id);

    if (error)
      return res
        .status(error.code ?? 400)
        .json({ message: error.message ?? "Unexpected error" });

    res.json({ message: `The schedule entry with the id ${id} was deleted` });
  };

  join = (req: Request, res: Response) => {
    const { id } = req.params;
    const { countryId } = req.body || {};

    const entryId = Number(id);
    if (Number.isNaN(entryId))
      return res.status(400).json({ error: "Invalid id" });
    if (!countryId) return res.status(400).json({ error: "Missing countryId" });

    const [error, entry] = this.service.joinClass(entryId, String(countryId));
    if (error) {
      return res
        .status(error.code ?? 400)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ entry });
  };

  leave = (req: Request, res: Response) => {
    const { id } = req.params;
    const { countryId } = req.body || {};

    const entryId = Number(id);
    if (Number.isNaN(entryId))
      return res.status(400).json({ error: "Invalid id" });
    if (!countryId) return res.status(400).json({ error: "Missing countryId" });

    const [error, entry] = this.service.leaveClass(entryId, String(countryId));
    if (error) {
      return res
        .status(error.code ?? 400)
        .json({ error: error.message ?? "Unexpected error" });
    }

    res.json({ entry });
  };
}

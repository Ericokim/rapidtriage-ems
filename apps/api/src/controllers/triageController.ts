import type { NextFunction, Request, Response } from "express";
import { triageSyncRequestSchema } from "@rapidtriage/shared";
import type { TriageService } from "../services/triageService";
import { HttpError } from "../middleware/errorHandler";

export interface TriageController {
  sync(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/** Thin controller: validate with the shared schema, delegate to the service. */
export function createTriageController(service: TriageService): TriageController {
  return {
    async sync(req, res, next) {
      try {
        const parsed = triageSyncRequestSchema.safeParse(req.body);
        if (!parsed.success) {
          throw new HttpError(400, "Invalid triage sync payload", {
            issues: parsed.error.issues,
          });
        }

        const { syncedIds } = await service.syncRecords(parsed.data);
        res.status(200).json({ ok: true, syncedIds });
      } catch (error) {
        next(error);
      }
    },
  };
}

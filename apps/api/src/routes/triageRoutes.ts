import { Router } from "express";
import type { TriageController } from "../controllers/triageController";

/** Mounts the single triage sync resource. */
export function createTriageRouter(controller: TriageController): Router {
  const router = Router();
  router.post("/sync", (req, res, next) => controller.sync(req, res, next));
  return router;
}

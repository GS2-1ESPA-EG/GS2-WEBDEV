// Recebe notificações do Orion, valida o body com Zod e delega ao TelemetryService
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as TelemetryService from "../services/telemetry.service.js";

const notifyBodySchema = z.object({
  subscriptionId: z.string(),
  data: z.array(z.record(z.unknown())),
});

const eventsQuerySchema = z.object({
  since: z.string().datetime().optional(),
});

export async function receiveNotification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = notifyBodySchema.parse(req.body);
    // TODO: chamar TelemetryService.processNotification(body)
    void TelemetryService;
    void body;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function listEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { spacecraftId } = req.params as { spacecraftId: string };
    const { since } = eventsQuerySchema.parse(req.query);
    // TODO: const events = await TelemetryService.getEvents(spacecraftId, since)
    void TelemetryService;
    res.json({ spacecraft_id: spacecraftId, since, events: [] });
  } catch (err) {
    next(err);
  }
}

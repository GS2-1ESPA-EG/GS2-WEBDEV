// Endpoints de itens: baixa (consumo) e listagem por nave
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as ItemService from "../services/item.service.js";

const consumeBodySchema = z.object({
  amount: z.number().positive().default(1),
});

export async function consumeItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId } = req.params as { itemId: string };
    const { amount } = consumeBodySchema.parse(req.body ?? {});
    const item = await ItemService.consume(itemId, amount);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function listItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { spacecraftId } = req.params as { spacecraftId: string };
    const items = await ItemService.listItems(spacecraftId);
    res.json({ spacecraft_id: spacecraftId, items });
  } catch (err) {
    next(err);
  }
}

import { Request, Response } from "express";
import { BarreirasService } from "../services/barreiras.service";
import { prisma } from "../repositories/prisma";

export const BarreirasController = {
  async list(_req: Request, res: Response) {
    const data = await BarreirasService.list();
    res.json(data);
  },

  async create(req: Request, res: Response) {
    const { descricao } = req.body ?? {};
    const created = await BarreirasService.create(descricao);
    res.status(201).json(created);
  },

  // 🔹 NOVO: excluir barreira
  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      await prisma.barreira.delete({ where: { id } });
      return res.status(204).send();
    } catch (err: any) {
      console.error("Erro ao excluir barreira:", err);
      return res
        .status(500)
        .json({ error: err.message ?? "Erro ao excluir barreira" });
    }
  },
};

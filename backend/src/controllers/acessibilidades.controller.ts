import { Request, Response } from "express";
import { prisma } from "../repositories/prisma";
import { AcessService } from "../services/acessibilidades.service";

export const AcessibilidadesController = {
  async list(_req: Request, res: Response) {
    const data = await AcessService.list();
    res.json(data);
  },

  async create(req: Request, res: Response) {
    const { descricao } = req.body ?? {};
    const created = await AcessService.create(descricao);
    res.status(201).json(created);
  },

  // 🔹 NOVO: excluir acessibilidade
  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      await prisma.acessibilidade.delete({ where: { id } });
      return res.status(204).send();
    } catch (err: any) {
      console.error("Erro ao excluir acessibilidade:", err);
      return res
        .status(500)
        .json({ error: err.message ?? "Erro ao excluir acessibilidade" });
    }
  },
};

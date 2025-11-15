// TiposController
import { Request, Response } from "express";
import { prisma } from "../repositories/prisma";

export const TiposController = {
  async list(_req: Request, res: Response) {
    const tipos = await prisma.tipoDeficiencia.findMany({
      orderBy: { id: "asc" },
    });
    res.json(tipos);
  },

  // 🔹 NOVO: listar tipos já com subtipos
  async listWithSubtipos(_req: Request, res: Response) {
    const tipos = await prisma.tipoDeficiencia.findMany({
      orderBy: { id: "asc" },
      include: {
        subtipos: {
          orderBy: { id: "asc" },
        },
      },
    });
    res.json(tipos);
  },

  async create(req: Request, res: Response) {
    const { nome } = req.body;
    if (!nome?.trim()) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const tipo = await prisma.tipoDeficiencia.create({
      data: { nome: nome.trim() },
    });

    res.status(201).json(tipo);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      await prisma.tipoDeficiencia.delete({ where: { id } });
      return res.status(204).send();
    } catch (err: any) {
      console.error("Erro ao excluir tipo:", err);
      return res
        .status(500)
        .json({ error: err.message ?? "Erro ao excluir tipo" });
    }
  },
};

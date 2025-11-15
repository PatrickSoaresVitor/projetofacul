import { Request, Response } from "express";
import { prisma } from "../repositories/prisma";

export const SubtiposController = {
  async list(req: Request, res: Response) {
    const data = await prisma.subtipoDeficiencia.findMany({
      orderBy: { id: "asc" },
    });
    res.json(data);
  },

  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const subtipo = await prisma.subtipoDeficiencia.findUnique({
      where: { id },
    });

    if (!subtipo) {
      return res.status(404).json({ error: "Subtipo não encontrado" });
    }

    res.json(subtipo);
  },

  async create(req: Request, res: Response) {
    const { nome, tipoId } = req.body;
    if (!nome?.trim()) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const subtipo = await prisma.subtipoDeficiencia.create({
      data: {
        nome: nome.trim(),
        tipoId: Number(tipoId),
      },
    });

    res.status(201).json(subtipo);
  },

  async listarBarreiras(req: Request, res: Response) {
    const subtipoId = Number(req.params.id);
    if (!Number.isFinite(subtipoId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const vinculos = await prisma.subtipoBarreira.findMany({
      where: { subtipoId },
      include: { barreira: true },
      orderBy: { barreiraId: "asc" },
    });

    const barreiras = vinculos.map((v) => v.barreira);
    return res.json({ barreiras });
  },

  // 🔹 NOVO: excluir subtipo
  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    try {
      await prisma.subtipoDeficiencia.delete({ where: { id } });
      return res.status(204).send();
    } catch (err: any) {
      console.error("Erro ao excluir subtipo:", err);
      return res
        .status(500)
        .json({ error: err.message ?? "Erro ao excluir subtipo" });
    }
  },
};

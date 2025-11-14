import { Request, Response } from "express";
import { CandidatosService } from "../services/candidatos.service";
import { prisma } from "../repositories/prisma";

export const CandidatosController = {
  async listar(req: Request, res: Response) {
    const data = await CandidatosService.listar();
    res.json(data);
  },

  async buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await CandidatosService.buscarPorId(id);
    res.json(data);
  },

  async criar(req: Request, res: Response) {
    const data = await CandidatosService.criar(req.body);
    res.status(201).json(data);
  },
  
};

export async function listarCandidaturas(req: Request, res: Response) {
  const candidatoId = Number(req.params.id);
  const candidaturas = await prisma.vagaCandidato.findMany({
    where: { candidatoId },
    orderBy: { createdAt: "desc" },
    include: {
      vaga: {
        include: { empresa: true },
      },
    },
  });
  res.json(candidaturas);
}
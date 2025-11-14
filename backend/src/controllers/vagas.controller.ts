import { Request, Response, NextFunction } from "express";
import { VagasRepo } from "../repositories/vagas.repo";
import { VagasService } from "../services/vagas.service";
import { prisma } from "../repositories/prisma";

export const VagasController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const empresaId = req.params.empresaId ? Number(req.params.empresaId) : undefined;
      if (empresaId !== undefined && !Number.isFinite(empresaId)) {
        return res.status(400).json({ error: "empresaId inválido" });
      }
      const data = await VagasRepo.list(empresaId);
      res.json(data);
    }catch (error){
      return next(error);
    }
  },

  async detalhar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const vaga = await VagasRepo.findById(id);
    if (!vaga) return res.status(404).json({ error: "Vaga não encontrada" });

    // “achatar” as N:N para resposta mais amigável
    const subtipos = vaga.subtiposAceitos.map((vs) => vs.subtipo);
    const acessibilidades = vaga.acessibilidades.map((va) => va.acessibilidade);

    res.json({
      id: vaga.id,
      descricao: vaga.descricao,
      escolaridade: vaga.escolaridade,
      empresa: vaga.empresa,
      subtipos,
      acessibilidades,
    });
  },

  async criar(req: Request, res: Response) {
    try {
      const { empresaId, descricao, escolaridade } = req.body;
      const vaga = await VagasService.criarVaga(Number(empresaId), descricao, escolaridade);
      res.status(201).json(vaga);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar vaga" });
    }
  },

  async vincularSubtipos(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const { subtipoIds } = req.body as { subtipoIds: number[] };
      await VagasService.vincularSubtipos(vagaId, subtipoIds);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao vincular subtipos" });
    }
  },

  async vincularAcessibilidades(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      const { acessibilidadeIds } = req.body as { acessibilidadeIds: number[] };
      await VagasService.vincularAcessibilidades(vagaId, acessibilidadeIds);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao vincular acessibilidades" });
    }
  },

  async getAcessibilidadesPossiveis(req: Request, res: Response) {
    try {
      const vagaId = Number(req.params.id);
      if (isNaN(vagaId)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const acess = await VagasService.listarAcessibilidadesPossiveis(vagaId);
      res.json(acess);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro ao listar acessibilidades" });
    }
  },
  async candidatar(req: Request, res: Response) {
  const vagaId = Number(req.params.vagaId);
  const { candidatoId } = req.body;

  if (!vagaId || !candidatoId) {
    return res.status(400).json({ error: "vagaId e candidatoId são obrigatórios" });
  }

  try {
    const existente = await prisma.vagaCandidato.findFirst({
      where: { vagaId, candidatoId },
    });
    if (existente) {
      return res.status(400).json({ error: "Candidato já inscrito nesta vaga" });
    }

    const candidatura = await prisma.vagaCandidato.create({
      data: { vagaId, candidatoId },
    });

    return res.status(201).json(candidatura);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar candidatura" });
  }
}

  
};

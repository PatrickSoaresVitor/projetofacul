import { Request, Response } from "express";
import { CandidatoSubtiposService } from "../services/candidatoSubtipos.service";
import { CandidatoSubtiposRepo } from "../repositories/candidatoSubtipos.repo";

export const CandidatoSubtiposController = {
  async listar(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const data = await CandidatoSubtiposService.listarPorCandidato(candidatoId);
    res.json(data);
  },

  async vincular(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const { subtipoIds } = req.body as { subtipoIds: number[] };
    console.log(subtipoIds)
    const data = await CandidatoSubtiposService.vincular(candidatoId, subtipoIds);
    res.json(data);
  },

  async salvarLista(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const { subtipoIds } = req.body as { subtipoIds: number[] };

    if (!Array.isArray(subtipoIds)) {
      return res.status(400).json({ error: "subtipoIds deve ser um array" });
    }

    try {
      await CandidatoSubtiposRepo.removerTodosDoCandidato(candidatoId);

      if (subtipoIds.length > 0) {
        await CandidatoSubtiposRepo.vincularLista(candidatoId, subtipoIds);
      }

      return res
        .status(200)
        .json({ message: "Subtipos atualizados com sucesso" });
    } catch (e) {
      console.error("ERRO AO SALVAR SUBTIPOS", e);
      return res.status(500).json({ error: "Erro ao atualizar subtipos" });
    }
  },
};
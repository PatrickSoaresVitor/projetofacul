import { Request, Response } from "express";
import { CandidatoSubtipoBarreirasService } from "../services/candidatoSubtipoBarreiras.service";
import { CandidatoSubtipoBarreirasRepo } from "../repositories/candidatoSubtipoBarreiras.repo";

export const CandidatoSubtipoBarreirasController = {
  async listar(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const data = await CandidatoSubtipoBarreirasService.listarPorCandidato(candidatoId);
    res.json(data);
  },

  async vincular(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const subtipoId = Number(req.params.subtipoId);
    const { barreiraIds } = req.body as { barreiraIds: number[] };
    const data = await CandidatoSubtipoBarreirasService.vincular(
      candidatoId,
      subtipoId,
      barreiraIds
    );
    res.json(data);
  },

  async salvarLista(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const subtipoId = Number(req.params.subtipoId);
    const { barreiraIds } = req.body as { barreiraIds: number[] };

    if (!Array.isArray(barreiraIds)) {
      return res.status(400).json({ error: "barreiraIds deve ser um array" });
    }

    try {
      // 1. remove todas as barreiras antigas desse subtipo para o candidato
      await CandidatoSubtipoBarreirasRepo.removerTodas(
        candidatoId,
        subtipoId
      );

      // 2. insere as novas
      if (barreiraIds.length > 0) {
        await CandidatoSubtipoBarreirasRepo.vincularLista(
          candidatoId,
          subtipoId,
          barreiraIds
        );
      }

      return res
        .status(200)
        .json({ message: "Barreiras atualizadas com sucesso" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Erro ao atualizar barreiras" });
    }
  },
};
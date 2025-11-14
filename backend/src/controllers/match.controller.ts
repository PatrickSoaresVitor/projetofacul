import { Request, Response, NextFunction } from "express";
import { prisma } from "../repositories/prisma";

export const MatchController = {
  // GET /match/:candidatoId
  async listarVagasCompativeis(req: Request, res: Response, next: NextFunction) {
    try {
      const candidatoId = Number(req.params.candidatoId);
      if (!Number.isFinite(candidatoId)) {
        return res.status(400).json({ error: "candidatoId inválido" });
      }

      // 1) Candidato + subtipos + barreiras
      const candidato = await prisma.candidato.findUnique({
        where: { id: candidatoId },
        include: {
          subtipos: {
            include: {
              subtipo: true,
              barreiras: { select: { barreiraId: true } },
            },
          },
        },
      });

      if (!candidato) {
        return res.status(404).json({ error: "Candidato não encontrado" });
      }
      if (!candidato.subtipos.length) {
        // Sem subtipos = não temos parâmetro para match
        return res.json([]);
      }

      const candidatoSubtipoIds = new Set(
        candidato.subtipos.map((s) => s.subtipo.id),
      );

      const barreiraIdsSelecionadas = new Set<number>(
        candidato.subtipos.flatMap((s) =>
          s.barreiras.map((b) => b.barreiraId),
        ),
      );

      // 2) Mapeia Barreiras -> Acessibilidades possíveis
      let mapaBarreiraParaAcess: Record<number, number[]> = {};
      if (barreiraIdsSelecionadas.size > 0) {
        const links = await prisma.barreiraAcessibilidade.findMany({
          where: { barreiraId: { in: Array.from(barreiraIdsSelecionadas) } },
          select: { barreiraId: true, acessibilidadeId: true },
        });

        mapaBarreiraParaAcess = links.reduce((acc, l) => {
          (acc[l.barreiraId] ||= []).push(l.acessibilidadeId);
          return acc;
        }, {} as Record<number, number[]>);
      }

      // 3) Vagas + subtipos aceitos + acessibilidades + empresa
      const vagas = await prisma.vaga.findMany({
        orderBy: { id: "asc" },
        include: {
          empresa: { select: { nome: true } },
          subtiposAceitos: { select: { subtipoId: true } },
          acessibilidades: { select: { acessibilidadeId: true } },
        },
      });

      // 4) Filtra vagas compatíveis
      const compatíveis = vagas.filter((v) => {
        const vagaSubtipoIds = new Set(
          v.subtiposAceitos.map((s) => s.subtipoId),
        );

        // Regra 1: precisa ter interseção de subtipos
        const temIntersecaoSubtipo = Array.from(candidatoSubtipoIds).some((id) =>
          vagaSubtipoIds.has(id),
        );
        if (!temIntersecaoSubtipo) return false;

        // Regra 2: barreiras (estratégia 3: ignorar barreiras sem mapeamento
        // e exigir ao menos UMA barreira coberta, se houver barreiras mapeadas)
        if (barreiraIdsSelecionadas.size > 0) {
          const acessDaVaga = new Set(
            v.acessibilidades.map((a) => a.acessibilidadeId),
          );

          let algumaBarreiraCoberta = false;
          let barreirasConsideradas = 0;

          for (const barreiraId of barreiraIdsSelecionadas) {
            const acessNecessarias = mapaBarreiraParaAcess[barreiraId];

            // barreira sem mapeamento → ignora no critério
            if (!acessNecessarias || acessNecessarias.length === 0) {
              continue;
            }

            barreirasConsideradas++;

            const cobreBarreira = acessNecessarias.some((aid) =>
              acessDaVaga.has(aid),
            );
            if (cobreBarreira) {
              algumaBarreiraCoberta = true;
              break;
            }
          }

          // Se não havia NENHUMA barreira com mapeamento,
          // não aplica restrição de barreiras (só subtipo decide)
          if (barreirasConsideradas > 0 && !algumaBarreiraCoberta) {
            return false;
          }
        }

        return true;
      });

      // 5) Payload enxuto
      const payload = compatíveis.map((v) => ({
        id: v.id,
        descricao: v.descricao,
        escolaridade: v.escolaridade,
        empresaId: v.empresaId,
        empresa: { nome: v.empresa?.nome ?? "" },
      }));

      return res.json(payload);
    } catch (e) {
      next(e);
    }
  },
};

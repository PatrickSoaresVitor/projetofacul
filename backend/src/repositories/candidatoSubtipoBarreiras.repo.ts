// src/repositories/candidatoSubtipoBarreiras.repo.ts
import { prisma } from "./prisma";

export const CandidatoSubtipoBarreirasRepo = {
  findByCandidato(candidatoId: number) {
    return prisma.candidatoSubtipoBarreira.findMany({
      where: { candidatoId },
      include: { barreira: true },
    });
  },

  create(candidatoId: number, subtipoId: number, barreiraIds: number[]) {
    const data = barreiraIds.map((barreiraId) => ({
      candidatoId,
      subtipoId,
      barreiraId,
    }));
    return prisma.candidatoSubtipoBarreira.createMany({
      data,
      skipDuplicates: true,
    });
  },

  // 🔹 REMOVE TODAS AS BARREIRAS desse subtipo para esse candidato
  async removerTodas(candidatoId: number, subtipoId: number) {
    const result = await prisma.candidatoSubtipoBarreira.deleteMany({
      where: { candidatoId, subtipoId },
    });

    console.log("[CandidatoSubtipoBarreirasRepo] removerTodas =>", {
      candidatoId,
      subtipoId,
      count: result.count,
    });

    return result;
  },

  // 🔹 INSERE a nova lista (após limpar)
  async vincularLista(
    candidatoId: number,
    subtipoId: number,
    barreiraIds: number[]
  ) {
    if (!barreiraIds.length) {
      console.log("[CandidatoSubtipoBarreirasRepo] vincularLista => lista vazia");
      return { count: 0 };
    }

    const data = barreiraIds.map((barreiraId) => ({
      candidatoId,
      subtipoId,
      barreiraId,
    }));

    const result = await prisma.candidatoSubtipoBarreira.createMany({
      data,
      skipDuplicates: true,
    });

    console.log("[CandidatoSubtipoBarreirasRepo] vincularLista =>", {
      candidatoId,
      subtipoId,
      count: result.count,
    });

    return result;
  },
};

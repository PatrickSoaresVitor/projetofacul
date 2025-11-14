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

  // 🔹 REMOVE todas as barreiras daquele subtipo para o candidato
  async removerTodas(candidatoId: number, subtipoId: number) {
    const result = await prisma.candidatoSubtipoBarreira.deleteMany({
      where: { candidatoId, subtipoId },
    });
    console.log(
      "[CandidatoSubtipoBarreirasRepo] removerTodas =>",
      { candidatoId, subtipoId, count: result.count }
    );
    return result;
  },

  // 🔹 CRIA a nova lista de barreiras
  async vincularLista(
    candidatoId: number,
    subtipoId: number,
    barreiraIds: number[]
  ) {
    if (!barreiraIds.length) return { count: 0 };

    const data = barreiraIds.map((barreiraId) => ({
      candidatoId,
      subtipoId,
      barreiraId,
    }));

    const result = await prisma.candidatoSubtipoBarreira.createMany({
      data,
      skipDuplicates: true,
    });

    console.log(
      "[CandidatoSubtipoBarreirasRepo] vincularLista =>",
      { candidatoId, subtipoId, count: result.count }
    );
    return result;
  },
};

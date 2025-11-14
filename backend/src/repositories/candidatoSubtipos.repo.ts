import { prisma } from "./prisma";

export const CandidatoSubtiposRepo = {
  findByCandidato(candidatoId: number) {
    return prisma.candidatoSubtipo.findMany({
      where: { candidatoId },
      include: { subtipo: true },
    });
  },

  create(candidatoId: number, subtipoIds: number[]) {
    const data = subtipoIds.map((subtipoId) => ({ candidatoId, subtipoId }));
    return prisma.candidatoSubtipo.createMany({ data, skipDuplicates: true });
  },

  async removerTodosDoCandidato(candidatoId: number) {
    const result = await prisma.candidatoSubtipo.deleteMany({
      where: { candidatoId },
    });

    console.log("[CandidatoSubtiposRepo] removerTodosDoCandidato =>", {
      candidatoId,
      count: result.count,
    });

    return result;
  },

  async vincularLista(candidatoId: number, subtipoIds: number[]) {
    // filtra qualquer coisa estranha (null, undefined, string, NaN, etc.)
    const limpos = (subtipoIds ?? []).filter(
      (id): id is number => typeof id === "number" && Number.isInteger(id)
    );

    if (!limpos.length) {
      console.log("[CandidatoSubtiposRepo] vincularLista => lista vazia", {
        candidatoId,
        subtipoIds,
      });
      return { count: 0 };
    }

    const data = limpos.map((subtipoId) => ({ candidatoId, subtipoId }));

    const result = await prisma.candidatoSubtipo.createMany({
      data,
      skipDuplicates: true,
    });

    console.log("[CandidatoSubtiposRepo] vincularLista =>", {
      candidatoId,
      subtipoIds,
      limpos,
      count: result.count,
    });

    return result;
  },
};

// src/services/vagas.service.ts
import { prisma } from "../repositories/prisma";

export const VagasService = {
  async criarVaga(empresaId: number, descricao: string, escolaridade: string) {
    if (!descricao?.trim()) throw new Error("Descrição é obrigatória");
    if (!escolaridade?.trim()) throw new Error("Escolaridade é obrigatória");

    return prisma.vaga.create({
      data: {
        empresaId,
        descricao: descricao.trim(),
        escolaridade: escolaridade.trim(),
      },
    });
  },

  async vincularSubtipos(vagaId: number, subtipoIds: number[]) {
    // zera tudo e recria (idempotente, igual fizemos no candidato)
    await prisma.vagaSubtipo.deleteMany({ where: { vagaId } });

    if (!subtipoIds.length) return;

    await prisma.vagaSubtipo.createMany({
      data: subtipoIds.map((subtipoId) => ({ vagaId, subtipoId })),
      skipDuplicates: true,
    });
  },

  async vincularAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    await prisma.vagaAcessibilidade.deleteMany({ where: { vagaId } });

    if (!acessibilidadeIds.length) return;

    await prisma.vagaAcessibilidade.createMany({
      data: acessibilidadeIds.map((acessibilidadeId) => ({
        vagaId,
        acessibilidadeId,
      })),
      skipDuplicates: true,
    });
  },

  /**
   * Acessibilidades "possíveis" para a vaga:
   * - baseadas nos subtipos aceitos pela vaga
   * - mapeando Subtipo -> Barreira -> Acessibilidade
   * - exclui acessibilidades já vinculadas à vaga
   */
 async listarAcessibilidadesPossiveis(vagaId: number) {
    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: {
        subtiposAceitos: { select: { subtipoId: true } },
      },
    });

    if (!vaga) {
      throw new Error("Vaga não encontrada");
    }

    const subtipoIds = vaga.subtiposAceitos.map((vs) => vs.subtipoId);

    // Se a vaga não tem subtipos, pode devolver lista vazia ou todas.
    // Aqui vou devolver TODAS, pra empresa poder escolher algo.
    if (!subtipoIds.length) {
      return prisma.acessibilidade.findMany({ orderBy: { id: "asc" } });
    }

    // Pega barreiras dos subtipos com suas acessibilidades
    const links = await prisma.subtipoBarreira.findMany({
      where: { subtipoId: { in: subtipoIds } },
      include: {
        barreira: {
          include: {
            acessibilidades: true, // BarreiraAcessibilidade[]
          },
        },
      },
    });

    const acessIdsSet = new Set<number>();
    for (const link of links) {
      for (const ba of link.barreira.acessibilidades) {
        acessIdsSet.add(ba.acessibilidadeId);
      }
    }

    if (!acessIdsSet.size) {
      return [];
    }

    const ids = Array.from(acessIdsSet);

    const acess = await prisma.acessibilidade.findMany({
      where: { id: { in: ids } },
      orderBy: { id: "asc" },
    });

    return acess;
  },
};

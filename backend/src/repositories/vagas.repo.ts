// src/repositories/vagas.repo.ts
import { prisma } from "./prisma";

type CreateVagaInput = {
  empresaId: number;
  descricao: string;
  escolaridade: string;
};

export const VagasRepo = {
  list(empresaId?: number) {
    return prisma.vaga.findMany({
      where: empresaId ? { empresaId } : undefined,
      orderBy: { id: "asc" },
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
        candidaturas: {
          include: {
            candidato: true, // 👈 AQUI: traz o candidato junto
          },
        },
      },
    });
  },

  findById(id: number) {
    return prisma.vaga.findUnique({
      where: { id },
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
        candidaturas: {
          include: {
            candidato: true, // 👈 idem aqui
          },
        },
      },
    });
  },

  create(data: CreateVagaInput) {
    return prisma.vaga.create({ data });
  },
};

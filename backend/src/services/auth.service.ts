import { prisma } from "../repositories/prisma";

type LoginInput = {
  email: string;
  senha: string;
};


export const AuthService = {
  async login({ email, senha }: LoginInput) {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !senha) {
      throw new Error("Credenciais inválidas");
    }


    const adminUser = (process.env.ADMIN_USER || "admin@pwo.com")
      .trim()
      .toLowerCase();
    const adminPass = process.env.ADMIN_PASS || "admin123";

    if (normalizedEmail === adminUser && senha === adminPass) {
      return {
        role: "admin" as const,
        user: { id: 0, nome: "Administrador" },
      };
    }

    const candidato = await prisma.candidato.findUnique({
      where: { email: normalizedEmail },
    });

    if (candidato && candidato.senha === senha) {
      return {
        role: "candidato" as const,
        user: { id: candidato.id, nome: candidato.nome },
      };
    }

    const empresa = await prisma.empresa.findUnique({
      where: { email: normalizedEmail },
    });

    if (empresa && empresa.senha === senha) {
      return {
        role: "empresa" as const,
        user: { id: empresa.id, nome: empresa.nome },
      };
    }

    throw new Error("Usuário ou senha inválidos");
  },
};

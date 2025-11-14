import { prisma } from "../repositories/prisma";

type LoginInput = {
  role: "empresa" | "candidato" | "admin";
  login: string; // email (empresa/candidato) ou usuario (admin)
  senha: string;
};

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

export const AuthService = {
  async login({ role, login, senha }: LoginInput) {
    if (!role || !login?.trim() || !senha) {
      throw new Error("Credenciais inválidas");
    }

    if (role === "admin") {
      const user = (process.env.ADMIN_USER || "admin").trim().toLowerCase();
      const pass = process.env.ADMIN_PASS || "admin123";
      if (login.trim().toLowerCase() === user && senha === pass) {
        return { role, user: { id: 0, nome: "Administrador" } }; // sem token por enquanto
      }
      throw new Error("Usuário ou senha inválidos");
    }

    if (role === "empresa") {
      // login por email (simples); se quiser, aceita CNPJ também
      const email = login.trim().toLowerCase();
      const byEmail = await prisma.empresa.findUnique({ where: { email } });
      let empresa = byEmail;

      // fallback: se o usuário digitar CNPJ como "login"
      if (!empresa) {
        const cnpj = onlyDigits(login);
        if (cnpj) {
          empresa = await prisma.empresa.findUnique({ where: { cnpj } });
        }
      }

      if (!empresa || empresa.senha !== senha) {
        throw new Error("Usuário ou senha inválidos");
      }
      return { role, user: { id: empresa.id, nome: empresa.nome } };
    }

    if (role === "candidato") {
      const email = login.trim().toLowerCase();
      const candidato = await prisma.candidato.findUnique({ where: { email } });
      if (!candidato || candidato.senha !== senha) {
        throw new Error("Usuário ou senha inválidos");
      }
      return { role, user: { id: candidato.id, nome: candidato.nome } };
    }

    throw new Error("Role inválida");
  },
};

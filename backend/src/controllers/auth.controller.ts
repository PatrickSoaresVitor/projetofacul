import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const AuthController = {
  async login(req: Request, res: Response) {
    const { role, login, senha } = req.body; // role: 'empresa' | 'candidato' | 'admin'
    const data = await AuthService.login({ role, login, senha });
    res.json(data);
  },
};

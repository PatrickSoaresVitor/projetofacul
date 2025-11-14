import { Router } from "express";
import { VagasController } from "../controllers/vagas.controller";

const r = Router();

r.get("/empresa/:empresaId", VagasController.listar);
r.get("/:id", VagasController.detalhar);
r.post("/", VagasController.criar);

// N:N
r.post("/:id/subtipos", VagasController.vincularSubtipos);
r.post("/:id/acessibilidades", VagasController.vincularAcessibilidades);

r.get("/:id/acessibilidades-disponiveis", VagasController.getAcessibilidadesPossiveis);
r.post("/:vagaId/candidatar", VagasController.candidatar);

export default r;

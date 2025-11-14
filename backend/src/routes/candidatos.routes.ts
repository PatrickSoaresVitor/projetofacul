import { Router } from "express";
import { CandidatosController } from "../controllers/candidatos.controller";
import { CandidatoSubtiposController } from "../controllers/candidatoSubtipos.controller";
import { CandidatoSubtipoBarreirasController } from "../controllers/candidatoSubtipoBarreiras.controller";
import { listarCandidaturas } from "../controllers/candidatos.controller";

const router = Router();

router.get("/", CandidatosController.listar);
router.post("/", CandidatosController.criar);
router.get("/:id", CandidatosController.buscarPorId);

router.get("/:id/subtipos", CandidatoSubtiposController.listar);
router.post("/:id/subtipos", CandidatoSubtiposController.vincular);
router.put("/:id/subtipos", CandidatoSubtiposController.salvarLista);

router.get("/:id/subtipos/barreiras", CandidatoSubtipoBarreirasController.listar);
router.post("/:id/subtipos/:subtipoId/barreiras", CandidatoSubtipoBarreirasController.vincular);
router.put("/:id/subtipos/:subtipoId/barreiras", CandidatoSubtipoBarreirasController.salvarLista
);
router.get("/:id/candidaturas", listarCandidaturas);

export default router;
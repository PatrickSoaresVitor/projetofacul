import { Router } from "express";
import { AcessibilidadesController } from "../controllers/acessibilidades.controller";

const router = Router();

router.get("/", AcessibilidadesController.list);
router.post("/", AcessibilidadesController.create);
router.delete("/:id", AcessibilidadesController.remove); // 🔹 NOVO

export default router;

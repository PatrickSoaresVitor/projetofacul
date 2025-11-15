import { Router } from "express";
import { SubtiposController } from "../controllers/subtipos.controller";

const router = Router();

// ordem: mais específicas antes
router.get("/:id/barreiras", SubtiposController.listarBarreiras);
router.get("/:id", SubtiposController.getOne);
router.get("/", SubtiposController.list);
router.post("/", SubtiposController.create);
router.delete("/:id", SubtiposController.remove); // 🔹 NOVO

export default router;

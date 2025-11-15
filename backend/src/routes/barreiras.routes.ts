import { Router } from "express";
import { BarreirasController } from "../controllers/barreiras.controller";

const router = Router();

router.get("/", BarreirasController.list);
router.post("/", BarreirasController.create);
router.delete("/:id", BarreirasController.remove); // 🔹 NOVO

export default router;

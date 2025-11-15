import { Router } from "express";
import { TiposController } from "../controllers/tipos.controller";

const router = Router();

// 🔹 IMPORTANTE: rota específica antes de "/" se algum dia você criar GET /:id
router.get("/com-subtipos", TiposController.listWithSubtipos);

router.get("/", TiposController.list);
router.post("/", TiposController.create);
router.delete("/:id", TiposController.remove);

export default router;

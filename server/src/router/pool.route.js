import express from "express";
import { getActivePools, joinPool } from "../controller/pool.controller.js";
import { AuthProtect } from "../middleware/auth.middelware.js";

const router = express.Router();

router.get("/active", getActivePools);
router.post("/join", AuthProtect, joinPool);

export default router;

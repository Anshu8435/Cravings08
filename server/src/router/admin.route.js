import express from "express";
import { getAllRestaurants, updateRestaurantStatus } from "../controller/admin.controller.js";
import { AdminAuthProtect } from "../middleware/auth.middelware.js";

const router = express.Router();

//admin Routes
router.get("/restaurants", AdminAuthProtect, getAllRestaurants);
router.patch("/restaurants/:id/status", AdminAuthProtect, updateRestaurantStatus);

export default router;

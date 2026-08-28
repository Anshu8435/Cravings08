import express from "express";
import { AuthProtect } from "../middleware/auth.middelware.js";
import { createOrder, getMyOrders, getAllOrdersForRider } from "../controller/order.controller.js";

const router = express.Router();

router.post("/create", AuthProtect, createOrder);
router.get("/my-orders", AuthProtect, getMyOrders);
router.get("/rider-orders", AuthProtect, getAllOrdersForRider);

export default router;

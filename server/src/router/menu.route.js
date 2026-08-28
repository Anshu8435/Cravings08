import express from "express";
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "../controller/menu.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middelware.js"; // Corrected filename

import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/:restaurantId", getMenuItems); // Public or generic auth depending on needs
router.post("/create", RestaurantAuthProtect, upload.single("image"), createMenuItem);
router.put("/update/:itemId", RestaurantAuthProtect, upload.single("image"), updateMenuItem);
router.delete("/delete/:itemId", RestaurantAuthProtect, deleteMenuItem);

export default router;

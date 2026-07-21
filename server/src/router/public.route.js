import express from "express";
import { ContactUsForm, GetRestaurants } from "../controller/public.controller.js";

const router = express.Router();

router.post("/contact-us", ContactUsForm);
router.get("/restaurants", GetRestaurants);


export default router;
import express from "express";
import { ContactUsForm, FeedbackForm, getRestaurants, getDishFeed, getDishReviews, GetAllRestaurants, GetRestaurantDetails } from "../controller/public.controller.js";

const router = express.Router();

router.post("/contact-us", ContactUsForm);
router.post("/feedback", FeedbackForm);
router.get("/restaurants", GetAllRestaurants);
router.get("/dishes/feed", getDishFeed);
router.get("/dishes/:id/reviews", getDishReviews);
router.get("/restaurant-detail/:restaurantId", GetRestaurantDetails);

export default router;
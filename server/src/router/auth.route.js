import express from "express";
import {
  LoginUser,
  LogoutUser,
  RegisterUser,
  SendOtp,
  VerifyOtp,
  ResetPassword
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/logout", LogoutUser);

router.post("/send-otp", SendOtp);
router.post("/verify-otp", VerifyOtp);
router.post("/reset-password", ResetPassword);


export default router;
import express from "express";
import multer from "multer";
import {
  EditUserProfile,
  UpdateUserPassword,
} from "../controller/common.controller.js";
import { AuthProtect } from "../middleware/auth.middelware.js";

const Upload = multer();
const router = express.Router();

router.patch("/change-password", AuthProtect, UpdateUserPassword);
router.put("/edit-profile", AuthProtect, Upload.single("displayPic"), EditUserProfile);

export default router;

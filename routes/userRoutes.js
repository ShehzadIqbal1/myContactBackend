import express, { Router } from "express";
import validateToken from "../middleware/validateTokenHandler.js";
import {
  loginUser,
  currentUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/current", validateToken,currentUser);

export default router;

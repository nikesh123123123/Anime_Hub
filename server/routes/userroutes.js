import express from "express";
import{registerUser,loginuser} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register",registerUser);

router.post("/login",loginuser);

router.get("/me", protect, (req, res) => {
    res.status(200).json(req.user);
});

export default router;

import express from "express";
import { toggleLike, getAnimeLikers } from "../controllers/likeController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();


router.post("/:animeId", protect, toggleLike);


router.get("/:animeId/users", getAnimeLikers);

export default router;
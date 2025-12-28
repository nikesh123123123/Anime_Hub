import express from "express";

import { rateAnime } from "../controllers/ratingController.js"; 
import { protect } from "../middlewares/auth.js";

const router = express.Router()

router.post("/:animeId/rate", protect, rateAnime);

export default router;
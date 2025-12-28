import express from "express";
import { addFavorite, getMyFavorites, removeFavorite } from "../controllers/favoriteController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();


router.get("/", protect, getMyFavorites);

router.post("/:id", protect, addFavorite);


router.delete("/:id", protect, removeFavorite);

export default router;
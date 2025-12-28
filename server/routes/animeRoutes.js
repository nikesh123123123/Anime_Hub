import express from "express";
import { 
    getanime, 
    createanime, 
    updateanime, 
    deleteanime,
    getSingleAnime 
} from "../controllers/animeController.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import {upload} from "../middlewares/uploadMiddleware.js";

const router = express.Router();


router.get("/", protect, getanime);


router.post("/", protect, adminOnly, upload.single("image"),createanime);
router.put("/:id", protect, adminOnly, upload.single("image"),updateanime);    
router.delete("/:id", protect, adminOnly, deleteanime);
router.get("/:id", protect, getSingleAnime);

export default router;
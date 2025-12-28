import express from "express";
import { 
    createComment, 
    getAnimeComments, 
    deleteComment, 
    togglePinComment,
    updateComment
     
} from "../controllers/commentController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();


router.get("/:animeId", getAnimeComments);


router.post("/", protect, createComment);


router.delete("/:id", protect, deleteComment);


router.patch("/:id/pin", protect, adminOnly, togglePinComment);

router.put("/:id", protect, updateComment);

export default router;
import Like from "../models/Like.js";
import Anime from "../models/Anime.js";
import mongoose from "mongoose";


export const toggleLike = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(animeId)) {
            return res.status(400).json({ success: false, message: "Invalid Anime ID format" });
        }

        const existingLike = await Like.findOne({ user: userId, anime: animeId });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            const updatedAnime = await Anime.findByIdAndUpdate(
                animeId, 
                { $inc: { likesCount: -1 } },
                { new: true }
            );
            
            return res.status(200).json({ 
                success: true, 
                message: "Unliked", 
                liked: false,
                currentLikes: updatedAnime?.likesCount || 0 
            });
        } else {
            const animeExists = await Anime.findById(animeId);
            if (!animeExists) {
                return res.status(404).json({ success: false, message: "Anime no longer exists" });
            }

            await Like.create({ user: userId, anime: animeId });
            const updatedAnime = await Anime.findByIdAndUpdate(
                animeId, 
                { $inc: { likesCount: 1 } },
                { new: true }
            );
            
            return res.status(201).json({ 
                success: true, 
                message: "Liked", 
                liked: true,
                currentLikes: updatedAnime?.likesCount || 0 
            });
        }
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Already liked" });
        }
        next(err);
    }
};


export const getAnimeLikers = async (req, res, next) => {
    try {
        const { animeId } = req.params;

      
        if (!mongoose.Types.ObjectId.isValid(animeId)) {
            return res.status(400).json({ success: false, message: "Invalid Anime ID format" });
        }

       
        const likers = await Like.find({ anime: animeId })
            .sort({ createdAt: -1 })
            .populate("user", "username") 
            .select("user createdAt");

        res.status(200).json({
            success: true,
            count: likers.length,
            data: likers 
        });
    } catch (err) {
        next(err);
    }
};
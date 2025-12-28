import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    animeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Anime', 
        required: true 
    },
    score: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    }
}, { timestamps: true });


RatingSchema.index({ userId: 1, animeId: 1 }, { unique: true });

const Rating = mongoose.model("Rating", RatingSchema);
export default Rating;
import mongoose from "mongoose";

const FavoriteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    anime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime", 
        required: true
    }
}, { timestamps: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);
export default Favorite;
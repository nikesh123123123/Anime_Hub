import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
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


likeSchema.index({ user: 1, anime: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);
export default Like;
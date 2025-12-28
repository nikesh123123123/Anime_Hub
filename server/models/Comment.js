import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
   
    text: {
        type: String,
        required: [true, "Comment text cannot be empty"],
        trim: true,
        maxlength: [500, "Comment is too long (max 500 characters)"]
    },

   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },

   
    anime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime", 
        required: true
    },

    
    isPinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
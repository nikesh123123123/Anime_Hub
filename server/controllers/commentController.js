import Comment from "../models/Comment.js";


export const createComment = async (req, res, next) => {
    try {
        const { text, animeId } = req.body;

        if (!text) {
            res.status(400);
            throw new Error("Comment text is required");
        }

        const comment = await Comment.create({
            text,
            anime: animeId,
            user: req.user._id 
        });

        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};


export const getAnimeComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ anime: req.params.animeId })
            .populate("user", "username")
            .sort({ isPinned: -1, createdAt: -1 }); 

        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};


export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }

        
        const isOwner = comment.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (isOwner || isAdmin) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Comment deleted successfully" });
        } else {
            res.status(401);
            throw new Error("You are not authorized to delete this comment");
        }
    } catch (err) {
        next(err);
    }
};


export const togglePinComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }

        
        comment.isPinned = !comment.isPinned;
        await comment.save();

        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }

      
        if (comment.user.toString() !== req.user._id.toString()) {
            res.status(403); 
            throw new Error("You can only edit your own comments");
        }

        comment.text = text || comment.text;
        const updatedComment = await comment.save();

        res.status(200).json(updatedComment);
    } catch (err) {
        next(err);
    }
};
import Favorite from "../models/Favorite.js";


export const addFavorite = async (req, res, next) => {
    try {
        const animeId = req.params.id; 
        const userId = req.user._id;   

      
        const alreadyExists = await Favorite.findOne({ user: userId, anime: animeId });
        
        if (alreadyExists) {
            res.status(400);
            throw new Error("This anime is already in your favorites");
        }

        const favorite = await Favorite.create({
            user: userId,
            anime: animeId
        });

        res.status(201).json(favorite);
    } catch (err) {
        next(err);
    }
};


export const getMyFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate("anime") 
            .sort({ createdAt: -1 });

      
if (!favorites || favorites.length === 0) {
    return res.status(200).json([]); 
}

       
        res.status(200).json(favorites);
    } catch (err) {
        next(err);
    }
};


export const removeFavorite = async (req, res, next) => {
    try {
       
        const favorite = await Favorite.findOneAndDelete({ 
            user: req.user._id, 
            anime: req.params.id 
        });

        if (!favorite) {
            res.status(404);
            throw new Error("Favorite not found in your list");
        }

        res.status(200).json({ message: "Removed from favorites successfully" });
    } catch (err) {
        next(err);
    }
};
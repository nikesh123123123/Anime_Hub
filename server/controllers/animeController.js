import Anime from "../models/Anime.js";
import Like from "../models/Like.js";
import fs from "fs";



export const getSingleAnime = async (req, res, next) => {
    try {
        const anime = await Anime.findById(req.params.id);
        
        if (!anime) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

       
        let isLiked = false;
        if (req.user) {
            const likeStatus = await Like.findOne({ 
                user: req.user._id, 
                anime: req.params.id 
            });
            isLiked = !!likeStatus; 
        }

       
        const recentLikers = await Like.find({ anime: req.params.id })
            .limit(5)
            .populate("user", "username")
            .select("user");

        res.status(200).json({
            success: true,
            data: {
                ...anime._doc,
                isLiked,
                recentLikers
            }
        });
    } catch (err) {
        next(err);
    }
};




export const getanime = async (req, res, next) => {
    try {
        const { search, genre, sort } = req.query;

        let queryObject = {};

       
        if (search && search.trim() !== "") {
            queryObject.name = {
                $regex: search.trim(),
                $options: "i" 
            };
        }

       
        if (genre && genre.trim() !== "") {
            const genreArray = genre.split(",").map(g => g.trim());

            queryObject.genre = {
                $in: genreArray
            };
        }

      
        let sortOption = { createdAt: -1 }; 
         if (sort === 'top_rated') {
    
          sortOption = { "ratingInfo.averageRating": -1 }
         }
        if (sort === "popular"){
            sortOption = { likesCount: -1 };
        }
        else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

      
        const animes = await Anime.find(queryObject).sort(sortOption);

        res.status(200).json({
            success: true,
            count: animes.length,
            data: animes
        });

    }
    catch (err) {
        next(err);
    }
};


export const createanime = async (req, res, next) => {
    try {
        let { name, description, genre } = req.body;

       
        if (genre) {
            if (typeof genre === 'string') {
                genre = genre.split(',').map(g => g.trim());
            } else if (!Array.isArray(genre)) {
                genre = [genre];
            }
        }

      
        if (!name || !description || !genre || genre.length === 0 || !req.file) {
           
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Please fill all fields and upload an image" });
        }

       
        const exist = await Anime.findOne({ name });
        if (exist) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Anime already exists" });
        }

       
        const normalizedPath = req.file.path.replace(/\\/g, "/");

      
        const anime = await Anime.create({
            name,
            description,
            genre,
            image: normalizedPath
        });

        res.status(201).json({ success: true, data: anime });

    } catch (err) {
       
        if (req.file) fs.unlinkSync(req.file.path);
        next(err);
    }
};


export const updateanime = async (req, res, next) => {
    try {
        let { name, description, genre } = req.body;

       
        if (!name && !description && !genre && !req.file ) {
            return res.status(400).json({ success: false, message: "At least one field is required to update" });
        }

        
        const anime = await Anime.findById(req.params.id);
        if (!anime) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

       
        if (name && name !== anime.name) {
            const exist = await Anime.findOne({ name });
            if (exist) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({ success: false, message: "Anime already exists" });
            }
            anime.name = name;
        }

       
        if (genre) {
            if (typeof genre === 'string') {
               
                genre = genre.split(',').map(g => g.trim());
            } else if (!Array.isArray(genre)) {
                genre = [genre];
            }
                
         if (genre.length === 0) {
             if (req.file) fs.unlinkSync(req.file.path);
             return res.status(400).json({
            success: false,
            message: "Genre cannot be empty"
            });
             }
            anime.genre = genre;
        }

       
        if (description) anime.description = description;

        
        if (req.file) {
            if (anime.image) {
                try {
                    
                    if (fs.existsSync(anime.image)) {
                        fs.unlinkSync(anime.image);
                    }
                } catch (err) {
                    console.log("Old file not found on disk, skipping deletion.");
                }
            }
            
            anime.image = req.file.path.replace(/\\/g, "/");
        }

        const updatedanime = await anime.save();
        
        res.status(200).json({
            success: true,
            data: updatedanime
        });

    } catch (err) {
       
        if (req.file) fs.unlinkSync(req.file.path);
        next(err);
    }
};



export const deleteanime = async (req, res, next) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (!anime) {
            
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

       
        try {
            if (anime.image && fs.existsSync(anime.image)) {
                fs.unlinkSync(anime.image);
            }
        } catch (err) {
            console.log(`Failed to delete the image file: ${err.message}`);
        }

       
        await Like.deleteMany({ anime: req.params.id });

        
        await Anime.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            success: true, 
            message: "Anime, associated image, and all likes deleted successfully" 
        });
    } catch (err) {
        next(err);
    }
};


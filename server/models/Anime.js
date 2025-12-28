import mongoose from "mongoose";

const AnimeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Anime name is required"],
        unique: true,
        trim: true
    },
   
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
   genre: {
    type: [String], 
    required: [true, "Genre is required"],
    enum: ["Action", "Isekai","Dark Fantasy", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi","Psychological","Military","Shounen","Supernatural"],
    default: []
   },
    image: {
        type: String, 
        required: [true, "Image file is required"]
    },
    likesCount: {
        type: Number,
        default: 0
    }
    ,
    ratingInfo: {
        averageRating: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 5
        },
        totalVotes: { 
            type: Number, 
            default: 0 
        },
        sumOfRatings: { 
            type: Number, 
            default: 0 
        }
    }
}, { timestamps: true });

const Anime = mongoose.model("Anime", AnimeSchema);
export default Anime;
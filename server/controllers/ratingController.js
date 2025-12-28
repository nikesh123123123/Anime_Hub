import Anime from "../models/Anime.js";
import Rating from "../models/Rating.js";

export const rateAnime = async (req, res, next) => {
    try {
        const { animeId } = req.params;
        const { score } = req.body; 
        const userId = req.user._id;

        if (score < 1 || score > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

     
        const existingRating = await Rating.findOne({ userId, animeId });

        let ratingDelta = score;
        let voteDelta = 1;

        if (existingRating) {
            
            ratingDelta = score - existingRating.score;
            voteDelta = 0; 

            existingRating.score = score;
            await existingRating.save();
        } else {
           
            await Rating.create({ userId, animeId, score });
        }

        
        const updatedAnime = await Anime.findByIdAndUpdate(
            animeId,
            {
                $inc: { 
                    "ratingInfo.sumOfRatings": ratingDelta, 
                    "ratingInfo.totalVotes": voteDelta 
                }
            },
            { new: true }
        );

      
        const newTotalVotes = updatedAnime.ratingInfo.totalVotes;
        const newSum = updatedAnime.ratingInfo.sumOfRatings;
        
        updatedAnime.ratingInfo.averageRating = newTotalVotes > 0 
            ? (newSum / newTotalVotes).toFixed(1) 
            : 0;

        await updatedAnime.save();

        res.status(200).json({
            success: true,
            averageRating: updatedAnime.ratingInfo.averageRating,
            totalVotes: newTotalVotes,
            userScore: score
        });

    } catch (err) {
        next(err);
    }
};
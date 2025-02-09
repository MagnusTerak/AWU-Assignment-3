//screeningRoutes.js
// Author: Tobias-hubs
import express from "express";

const router = express.Router();

router.get("/screenings/:movieId", async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const url = `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie&filters[movie]=${movieId}`;
       
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
       
        // Filter screenings based on movieId and upcoming date
        const now = new Date();
        console.log('Current time:', now);
        const filteredScreenings = data.data.filter(screening => {
            const screeningDate = new Date(screening.attributes.start_time);
           
            const isUpcoming = screeningDate > now;
            const movieData = screening.attributes.movie.data; 
        
            const isCorrectMovie = movieData && movieData.id === parseInt(movieId);
            
            console.log(`Screening ${screening.id}: isUpcoming=${isUpcoming}, isCorrectMovie=${isCorrectMovie}`);
            
            return isUpcoming && isCorrectMovie;
        });
       
        res.json(filteredScreenings);
    } catch (error) {
        console.error('Error fetching screenings:', error.message);
        res.status(500).send(`Error fetching screenings: ${error.message}`);
    }
});

export default router;
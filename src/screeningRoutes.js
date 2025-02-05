//screeningRoutes.js
import express from "express";

const router = express.Router();

router.get("/screenings/:movieId", async (req, res) => {
    try {
        const movieId = req.params.movieId;
        console.log("Mottaget movieId från request:", movieId); //
        const url = `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie&filters[movie]=${movieId}`;
        console.log('API Request URL:', url);
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Alla screenings från API:", JSON.stringify(data.data, null, 2)); //
        console.log('API response:', data);

        // Filter screenings based on movieId and upcoming date
        const now = new Date();
        console.log('Current time:', now);
        const filteredScreenings = data.data.filter(screening => {
            const screeningDate = new Date(screening.attributes.start_time);
            console.log('Screening date:', screeningDate);

            const isUpcoming = screeningDate > now;
            const movieData = screening.attributes.movie.data; 
        
            const isCorrectMovie = movieData && movieData.id === parseInt(movieId);
            console.log("Requested movieId:", movieId);
            console.log("API Movie Data:", screening.attributes.movie.data);

            console.log(`Screening ${screening.id}: isUpcoming=${isUpcoming}, isCorrectMovie=${isCorrectMovie}`);
            
            return isUpcoming && isCorrectMovie;
        });
       
        console.log('Filtered screenings:', filteredScreenings);
        res.json(filteredScreenings);
    } catch (error) {
        console.error('Error fetching screenings:', error.message);
        res.status(500).send(`Error fetching screenings: ${error.message}`);
    }
});

export default router;
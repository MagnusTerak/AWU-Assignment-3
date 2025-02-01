// // screeningsRoutes.js
// import express from "express";
// const router = express.Router();

// // Route för att hämta kommande visningar för en specifik film
// router.get("/screenings/:movieId", async (req, res) => {
//     try {
//         const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings?filters[movie]=${req.params.movieId}&populate=movie`);
//         console.log('API Request URL:', url);
//         const data = await response.json();
//         console.log('API response:', data); 
//         res.json(data.data);
//     } catch (error) {
//         console.error('Error fetching screenings: ', error); 
//         res.status(500).send("Error fetching screenings");
//     }
// });

// export default router;

import express from "express";
const router = express.Router();

router.get("/screenings/:movieId", async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const url = `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie`;
        console.log('API Request URL:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        // Filtrera visningar baserat på movieId
        const filteredScreenings = data.data.filter(screening => screening.attributes.movie.data.id === parseInt(movieId));
        
        res.json(filteredScreenings);
    } catch (error) {
        console.error('Error fetching screenings:', error.message);
        res.status(500).send(`Error fetching screenings: ${error.message}`);
    }
});

export default router;
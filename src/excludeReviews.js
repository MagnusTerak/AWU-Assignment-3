//excludeReviews.js 
// Author: Tobias-hubs
import express from 'express';
const router = express.Router();

async function fetchVerifiedReviews(movieId, page = 1, pageSize = 10)  {
    try { 
        const apiUrl = `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Error fetching reviews');
        }
        const data = await response.json();
        return data.data.filter(review => review.attributes.verified === true);

    } catch (error) {
        console.error(`Error fetching reviews: ${error.message}`);
       throw new Error('Error fetching reviews.');
    }
}

router.get('/reviews', async (req, res) => {
    try { 
        const movieId = req.query.filters?.movie;
        const page = req.query.pagination?.page || 1;
        const pageSize = req.query.pagination?.pageSize || 10;
    
        const verifiedReviews = await fetchVerifiedReviews(movieId, page, pageSize);
        res.json({ data: verifiedReviews});
    } catch (error ) {
        res.status(500).send(`Error fetching reviews: ${error.message}`);
    }
}); 

// Route for calculating the average of verified reviews    
router.get('/reviews/average-rating', async (req, res) => {
    try { 
        console.log("Query: ", req.query); ///

        const movieId = req.query.filters?.movie;
        if (!movieId) {
            return res.status(400).send('Movie ID is required');
        }

        const verifiedReviews = await fetchVerifiedReviews(movieId);

        if (verifiedReviews.length === 0 ) { 
            return res.json ({ averageRating: null, message: 'No verified reviews found'});

        }

        const validReviews = verifiedReviews.filter(review => { 
            const rating = review.attributes.rating; 
            return typeof rating === 'number' && rating >= 1 && rating <= 5;

        });

        if (validReviews.length === 0) {
            return res.json({ averageRating: null, message: 'No valid ratings found'});
        }

        const totalRating = validReviews.reduce((sum, review) => sum + review.attributes.rating, 0);
        const averageRating = totalRating / validReviews.length;

        res.json({ averageRating: averageRating.toFixed(1)});
    }catch (error) {
        res.status(500).send(`Error fetching reviews: ${error.message}`);
    }
});

export default router;
const REVIEW_API = "https://plankton-app-xhkom.ondigitalocean.app/api/reviews";

const getReviewsFromAPI = async (movieId, page, pageSize) => {
    try {
        const response = await fetch(
            `${REVIEW_API}?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Fetched data from API:", data); // Här kan vi se om det är rätt data som kommer in
        return data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export default getReviewsFromAPI;

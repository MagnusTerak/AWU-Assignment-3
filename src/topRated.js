const API = "https://plankton-app-xhkom.ondigitalocean.app/api/";

export const retrieveTopRatedMovies = async function () {
    const response = await fetch(API + "movies");
    const jsonData = await response.json();

    const topRatedMovies = [];
    
    for (const movie of jsonData.data) {
        const rating = await retrieveReviews(movie.id);

        if (!rating) {
            continue;
        }

        const movieData = {
            rating: parseFloat(rating),
            id: movie.id,
            ...movie.attributes
        };

        topRatedMovies.push(movieData);
    }

    topRatedMovies.sort((a, b) => b.rating - a.rating);

    return topRatedMovies;
}

const retrieveReviews = async function (movieId) {
    const url = `${API}reviews?filters[movie]=${movieId}`;
    const response = await fetch(url);
    const jsonData = await response.json();

    let movieRating;

    for (let currentReviewIndex = 0; currentReviewIndex < jsonData.data.length; currentReviewIndex++) {
        const review = jsonData.data[currentReviewIndex];
        
        const currentDate = new Date();
        const movieDate = new Date(review.attributes.updatedAt);
        const dateDiffrenceInMs = currentDate - movieDate;
        const dateDiffrenceInDays = dateDiffrenceInMs / (1000 * (60 * 60) * 24);

        if (dateDiffrenceInDays.toFixed(0) <= 30) {
            movieRating = (!isNaN(movieRating) ? movieRating + review.attributes.rating : review.attributes.rating);
        }
    }

    if (!isNaN(movieRating)) {
        movieRating = movieRating / jsonData.data.length;
    
        return movieRating.toFixed(1);
    } else {
        return false
    }
}
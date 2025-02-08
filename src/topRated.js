const API = "https://plankton-app-xhkom.ondigitalocean.app/api/";

export const retrieveTopRatedMovies = async function (mockData) {
    let jsonData;

    if (mockData) {
        jsonData = mockData; 
    } else {
        const response = await fetch(API + "movies");
        jsonData = await response.json();
    }

    const topRatedMovies = [];
    
    for (const movie of jsonData.data) {
        const ratingData = mockData 
            ? { ratingOfMovie: movie.rating, reviewsCounted: 1 }
            : await retrieveReviews(movie.id);

        if (!ratingData || ratingData.reviewsCounted === 0) {
            continue;
        }

        const movieData = {
            rating: parseFloat(ratingData.ratingOfMovie),
            id: movie.id,
            ...movie.attributes
        };

        topRatedMovies.push(movieData);
    }

    topRatedMovies.sort((a, b) => b.rating - a.rating);

    return topRatedMovies.slice(0, 5);
}

export const retrieveReviews = async function (movieId, mockData) {
    let jsonData; 

    if (mockData) {
        jsonData = { data: mockData };
    } else {
        const url = `${API}reviews?filters[movie]=${movieId}`;
        const response = await fetch(url);
        jsonData = await response.json();
    }


    let movieRating = 0;
    let reviewsCounted = 0;

    for (let currentReviewIndex = 0; currentReviewIndex < jsonData.data.length; currentReviewIndex++) {
        const review = jsonData.data[currentReviewIndex];
        
        const currentDate = new Date();
        const movieDate = new Date(review.attributes.updatedAt);
        const dateDiffrenceInMs = currentDate - movieDate;
        const dateDiffrenceInDays = dateDiffrenceInMs / (1000 * (60 * 60) * 24);

        if (dateDiffrenceInDays.toFixed(0) <= 30) {
            movieRating += review.attributes.rating;
            reviewsCounted++
        }
    }

    if (reviewsCounted === 0) {
        return { ratingOfMovie: 0, reviewsCounted: 0 };
    }

    return { ratingOfMovie: movieRating / reviewsCounted, reviewsCounted };
}
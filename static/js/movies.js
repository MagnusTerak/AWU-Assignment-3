/**
 *
 * @author Jörgen Lindström
 */
//console.log('movies.js loaded');

let moviesArray = [];

export const fetchMovieData = async () => {
    try {
        const response = await fetch('/static/database/movies.json');
        moviesArray = await response.json(); // Populate the array
        console.log(moviesArray);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

export { moviesArray };
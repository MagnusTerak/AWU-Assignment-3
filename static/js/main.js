import "./aboutUs.js";
import "./header.js";
import "./filtering.js";
import "./upcomingMovies.js";
import "./components/footer.js";
import "./carousel.js";
import "./cafe.js";
import "./contact.js";
import "./movieRating.js";
import "./topRatedMovies.js";
import "./upcomingScreenings.js";
import { fetchMovieData, moviesArray } from "./movies.js";
import "./login.js";

export const initializeMovieData = async () => {
  await fetchMovieData(); // Ensure the data is fetched before proceeding
  console.log("Data loaded in main.js:", moviesArray);
};

export { moviesArray }; // Re-export the array

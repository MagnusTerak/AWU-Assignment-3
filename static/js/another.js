/**
 *
 * @author Jörgen Lindström
 */

import { initializeMovieData, moviesArray } from './main.js';

const useData = async () => {
    await initializeMovieData(); // Wait for the data to load
    console.log('Data loaded in your file:', moviesArray);
};

useData();

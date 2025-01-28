const API = "https://plankton-app-xhkom.ondigitalocean.app/api/movies";

export async function getMoviesFromAPI() {
    const response = await fetch(API)
    const jsonData = await response.json();

    return jsonData;
}

export async function getMovieFromId(id) {
    const response = await fetch(API + "/" + id);
    const jsonData = await response.json();

    return jsonData;
}
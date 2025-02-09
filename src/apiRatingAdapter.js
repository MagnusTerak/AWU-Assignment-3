const apiRatingAdapter = {
  retrieveAllReviews: async (id) => {
    const url = `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${id}`;
    const resp = await fetch(url);
    const payload = await resp.json();

    return payload.data;
  },
  retrieveImdbId: async (id) => {
    const url = `https://plankton-app-xhkom.ondigitalocean.app/api/movies/${id}`;
    const resp = await fetch(url);
    const payload = await resp.json();

    const imdbId = payload.data.attributes.imdbId;
    return imdbId;
  },
  retrieveImdbRating: async (imdbId) => {
    const url = `http://www.omdbapi.com/?apikey=3b3ffb9c&i=${imdbId}`;
    const resp = await fetch(url);
    const payload = await resp.json();

    const imdbRating = payload.imdbRating;
    return parseFloat(imdbRating);
  },
};

export default apiRatingAdapter;

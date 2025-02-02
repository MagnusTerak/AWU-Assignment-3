const cmsAdapter = {
  retrieveAllRatings: async (id) => {
    const url =
      "https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=" +
      id;
    const resp = await fetch(url);
    const payload = await resp.json();
    return payload.data;
  },
};

export default cmsAdapter;

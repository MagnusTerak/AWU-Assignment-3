const cmsAdapter = {
  loadScreenings: async () => {
    const url =
      "https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie";
    const resp = await fetch(url);
    const payload = await resp.json();

    return payload.data;
  },
};

export default cmsAdapter;

export default async function getScreenings(cmsAdapter) {
  const screenings = await cmsAdapter.loadScreenings();

  const today = new Date();
  const inFiveDays = new Date();
  inFiveDays.setDate(today.getDate() + 5);

  const filteredScreenings = screenings.filter((screening) => {
    const screeningDate = new Date(screening.attributes.start_time);
    return screeningDate >= today && screeningDate <= inFiveDays;
  });

  const limitedScreenings = filteredScreenings.slice(0, 10);

  return limitedScreenings;
}

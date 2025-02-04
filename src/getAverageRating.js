export default async function getAverageRating(apiRatingAdapter, id) {
  const ratings = await apiRatingAdapter.retrieveAllReviews(id);

  let sumRatings = 0;
  let countRatings = 0;

  ratings.forEach((review) => {
    const rating = review.attributes.rating;
    sumRatings += rating;
    if (rating !== null) countRatings++;
    // if (rating) countRatings++;
    // If the minimum rating is 1 star.
  });

  const averageRating = sumRatings / countRatings;

  if (countRatings >= 5) {
    return averageRating;
  } else if (countRatings !== 0) {
    const imdbId = await apiRatingAdapter.retrieveImdbId(id);
    const imdbRating = await apiRatingAdapter.retrieveImdbRating(imdbId);
    return imdbRating;
  } else {
    return [];
  }
}

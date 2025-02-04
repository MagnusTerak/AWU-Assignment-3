export default async function getAverageRating(apiRatingAdapter, id) {
  const ratings = await apiRatingAdapter.retrieveAllRatings(id);
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

  if (averageRating) {
    return averageRating;
  } else {
    return [];
  }
}

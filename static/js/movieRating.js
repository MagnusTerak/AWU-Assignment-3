async function fetchMovieRating(id) {
  const resp = await fetch(`/movies/${id}/average-rating`);
  if (resp.ok) {
    const payload = await resp.json();
    const averageRating = payload.data;
    const ratingText = document.querySelector(".singleMovie_rating");
    ratingText.innerText = averageRating;
  } else {
    console.error("ERROR: Average rating could not be found.");
  }
}

if (document.querySelector(".singleMovie")) {
  const movieId = document.querySelector(".singleMovie").getAttribute("id");
  fetchMovieRating(movieId);
}

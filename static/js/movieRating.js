async function fetchMovieRating(id) {
  const resp = await fetch(`/movies/${id}/average-rating`);
  if (resp.ok) {
    const payload = await resp.json();
    const averageRating = payload.data;
    document
      .querySelector(".singleMovie__rating_star-empty")
      .setAttribute("title", `Betyg: ${averageRating} av 5.`);
    document.querySelector(".singleMovie__rating_star-filled").style.width =
      averageRating * 20 + "%";
  } else {
    console.error("ERROR: Average rating could not be found.");
  }
}

if (document.querySelector(".singleMovie")) {
  const movieId = document.querySelector(".singleMovie").getAttribute("id");
  fetchMovieRating(movieId);
}

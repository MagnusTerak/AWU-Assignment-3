async function fetchMovieRating(id) {
  const emptyStar = document.querySelector(".singleMovie__rating_star-empty");
  const filledStar = document.querySelector(".singleMovie__rating_star-filled");

  const resp = await fetch(`/movies/${id}/average-rating`);
  if (resp.ok) {
    const payload = await resp.json();
    const averageRating = payload.data;
    emptyStar.setAttribute("title", `Betyg: ${averageRating} av 5.`);
    filledStar.style.width = averageRating * 20 + "%";
  } else {
    console.error("ERROR: Average rating could not be found.");
  }
}

if (document.querySelector(".singleMovie")) {
  const movieId = document.querySelector(".singleMovie").getAttribute("id");
  fetchMovieRating(movieId);
}

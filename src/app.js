import express from "express";
import expressLayouts from "express-ejs-layouts";
import { getMoviesFromAPI, getMovieFromId } from "./movieRetriever.js";
import getAverageRating from "./getAverageRating.js";
import apiRatingAdapter from "./apiRatingAdapter.js";

const app = express();

app.use("/static", express.static("./static"));
app.use(expressLayouts);
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/cafe", (req, res) => {
  res.render("cafe");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/movies", async (req, res) => {
  let loadedMovies = await getMoviesFromAPI();

  res.render("movies", { movies: loadedMovies.data });
});

import MarkdownIt from "markdown-it";

const md = MarkdownIt();

app.get("/movie/:id", async (req, res) => {
  let loadedMovie = await getMovieFromId(req.params.id);

  if (!loadedMovie || !loadedMovie.data) {
    return res.status(404).send("Sidan du letar efter existerar inte.");
  }

  let introTextHTML = md.render(loadedMovie.data.attributes.intro);

  res.render("movie", {
    movie: loadedMovie.data,
    markedIntroText: introTextHTML,
  });
});

app.get("/movies/:id/average-rating", async (req, res) => {
  const { id } = req.params;
  const rating = await getAverageRating(apiRatingAdapter, id);
  res.status(200).json({
    data: rating,
  });
});

app.use((req, res, next) => {
  res.status(404).send("Sidan du letar efter existerar inte.");
});

export { app };

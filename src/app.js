import express from "express";
import sanitizeHtml from "sanitize-html";
import { body, validationResult } from "express-validator";
import expressLayouts from "express-ejs-layouts";
import { getMoviesFromAPI, getMovieFromId } from "./movieRetriever.js";
import getScreenings from "./screenings.js";
import screeningRoutes from "./screeningRoutes.js";
import excludeReviews from "./excludeReviews.js";
import getAverageRating from "./getAverageRating.js";
import apiRatingAdapter from "./apiRatingAdapter.js";
import { retrieveTopRatedMovies } from "./topRated.js";
import cmsAdapter from "./cmsAdapter.js";
import { generateJwt, verifyJwt } from "./jwtAuth.js";

const app = express();

app.use("/static", express.static("./static"));
app.use(express.json());
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

app.get("/movies/screenings", async (req, res) => {
  const screenings = await getScreenings(cmsAdapter);
  res.status(200).json({
    data: screenings,
  });
});

// Route for screenings
app.get("/movies/:id/average-rating", async (req, res) => {
  const { id } = req.params;
  const rating = await getAverageRating(apiRatingAdapter, id);
  res.status(200).json({
    data: rating,
  });
});

app.use("/api", screeningRoutes);

app.post("/api/credentials", async (req, res) => {
  generateJwt(req, res);
});
// Route for excluding reviews
app.use("/api", excludeReviews);

///////////////////// POST REVIEW //////////////////////////////

app.post(
  "/api/reviews",
  [
    // Validate and sanitize input data
    body("comment")
      .trim()
      .customSanitizer((value) =>
        sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
      )
      .notEmpty()
      .withMessage("Kommentar får inte vara tom."),

    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Betyg måste vara mellan 1 och 5."),

    body("author")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Namn/alias får inte vara tomt."),

    body("movie")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Film-ID får inte vara tomt."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comment, rating, movie } = req.body;

    const payload = verifyJwt(req);

    try {
      const response = await fetch(
        "https://plankton-app-xhkom.ondigitalocean.app/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: payload.token,
          },
          body: JSON.stringify({
            data: {
              comment: comment,
              rating: rating,
              author: payload.author,
              movie: movie,
            },
          }),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`API-fel: ${response.status} - ${responseText}`);
      }

      const responseData = JSON.parse(responseText);
      res.json({ message: "Recensionen har skickats!", data: responseData });
    } catch (error) {
      // console.log("API-fel:", error.message);
      // console.log("Fullständigt fel:", error); // Logga hela felet
      res.status(500).json({ error: error.message });
    }
  }
);

///////////////////////////////// Top Rated Movies /////////////////////////////////

app.get("/movies/top-rated-movies", async (req, res) => {
  const movies = await retrieveTopRatedMovies();

  res.json(movies);
});

/////////////////////////// 404 /////////////////////////////////

app.use((req, res, next) => {
  res.status(404).send("Sidan du letar efter existerar inte.");
});

export { app };

import express from "express";
import expressLayouts from "express-ejs-layouts";
import { getMoviesFromAPI, getMovieFromId } from "./movieRetriever.js";

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

///////////////////// POST REVIEW //////////////////////////////

app.post("/api/reviews", async (req, res) => {

  const { comment, rating, author, movie } = req.body;

  if (!comment || !rating || !author) {
    return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
  }

  try {
    const bodyToSend = JSON.stringify({
      data: {
        comment: comment,
        rating: rating,
        author: author,
        movie: movie
      }
    });

    const response = await fetch("https://plankton-app-xhkom.ondigitalocean.app/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyToSend,
    });

    const responseText = await response.text();
    console.log("🔹 API-status:", response.status);
    console.log("🔹 API-svar (rådata):", responseText);

    if (!response.ok) {
      throw new Error(`API-fel: ${response.status} - ${responseText}`);
    }

    const responseData = JSON.parse(responseText);
    res.json({ message: "Recensionen har skickats!", data: responseData });
  } catch (error) {
    console.log("❌ API-fel:", error.message);
    console.log("❌ Fullständigt fel:", error);  // Logga hela felet
    res.status(500).json({ error: error.message });
  }
});

/////////////////////////// 404 /////////////////////////////////

app.use((req, res, next) => {
  res.status(404).send("Sidan du letar efter existerar inte.");
});

export { app };

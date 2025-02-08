import { expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app.js";

test("/Movies page should list all titles of the movies correct.", async () => {
  const response = await request(app)
    .get("/movies")
    .expect("Content-Type", /html/)
    .expect(200);

  expect(response.text).toMatch("Pulp Fiction");
  expect(response.text).toMatch("The Shawshank Redemption");
  expect(response.text).toMatch("Forrest Gump");
  expect(response.text).toMatch("Fire Walk With Me");
  expect(response.text).toMatch("Isle of dogs");
  expect(response.text).toMatch("Min granne Totoro");
  expect(response.text).toMatch("The Muppets");
  expect(response.text).toMatch("Encanto");
  expect(response.text).toMatch("Training Day");
});

test("Non existing site should answer with status 404", async () => {
  const response = await request(app).get("/movie/2314");

  expect(response.status).toBe(404);
  expect(response.text).toContain("Sidan du letar efter existerar inte.");
});

test("POST /api/reviews - Will not approve a review without a JWT", async () => {
  const response = await request(app)
    .post("/api/reviews")
    .send({
      comment: "Bra film!",
      rating: 5,
      author: "Test User",
      movie: "1",
    })
    .expect(500);

  expect(response.body).toStrictEqual({
    error: "Cannot read properties of undefined (reading 'token')",
  });
});

test("POST /api/reviews - Should return 400 if rating is outside 0-5", async () => {
  const response = await request(app)
    .post("/api/reviews")
    .send({
      comment: "Dålig film!",
      rating: 10, // Ogiltigt betyg
      author: "Test User",
      movie: "1",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ msg: "Betyg måste vara mellan 1 och 5." }),
    ])
  );
});

test("POST /api/reviews - Should return 400 if rating is not a number", async () => {
  const response = await request(app)
    .post("/api/reviews")
    .send({
      comment: "OK film",
      rating: "bra", // Ogiltigt betyg
      author: "Test User",
      movie: "1",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ msg: "Betyg måste vara mellan 1 och 5." }),
    ])
  );
});

test("POST /api/reviews - Should return 400 if movie ID is missing", async () => {
  const response = await request(app)
    .post("/api/reviews")
    .send({
      comment: "Fantastisk film!",
      rating: 4,
      author: "Test User",
      movie: "", // Tomt fält
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ msg: "Film-ID får inte vara tomt." }),
    ])
  );
});

test("POST /api/reviews - Should return 400 if a field is not filled", async () => {
  const response = await request(app)
    .post("/api/reviews")
    .set("Content-Type", "application/json")
    .send({
      comment: "Bra film!",
      rating: 5,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors.length).toBeGreaterThan(0); // Kontrollera att det finns minst ett fel
});

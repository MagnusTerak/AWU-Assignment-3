import { describe, expect, it } from "@jest/globals";
import getAverageRating from "../src/getAverageRating.js";

describe("getAverageRating()", () => {
  const movieId = 2;

  it("returns an empty array", async () => {
    const apiRatingAdapter = {
      retrieveAllReviews: async () => [],
    };

    const averageRating = await getAverageRating(apiRatingAdapter, movieId);
    expect(averageRating).toHaveLength(0);
  });

  it("returns average rating, if (5 <= reviews)", async () => {
    const testArray = [
      mockReview({ rating: 2 }),
      mockReview({ rating: 5 }),
      mockReview({ rating: 3 }),
      mockReview({ rating: 1 }),
      mockReview({ rating: 2 }),
    ];
    // Rounds the average rating to the nearest, tenths decimal place. Though it is converted into a string value.
    const testAverage = ((2 + 5 + 3 + 1 + 2) / 5).toFixed(1);

    const apiRatingAdapter = {
      retrieveAllReviews: async () => testArray,
    };

    const averageRating = await getAverageRating(apiRatingAdapter, movieId);
    expect(testArray.length).toBeGreaterThanOrEqual(5);
    expect(averageRating).toBe(parseFloat(testAverage));
  });

  it("returns average rating from IMDB, if (5 > reviews)", async () => {
    const testArray = [
      mockReview({ rating: 2 }),
      mockReview({ rating: 5 }),
      mockReview({ rating: 3 }),
      mockReview({ rating: 1 }),
    ];
    const testId = mockMovie().attributes.imdbId;
    const testImdb = mockImdb();
    const testRatingString = parseFloat(testImdb.imdbRating).toFixed(1);
    const testRatingInt = parseFloat(testRatingString);

    const apiRatingAdapter = {
      retrieveAllReviews: async () => testArray,
      retrieveImdbId: async () => testId,
      retrieveImdbRating: async () => testRatingInt,
    };

    const averageRating = await getAverageRating(apiRatingAdapter, movieId);
    expect(testArray.length).toBeLessThan(5);
    expect(testId).toMatch(testImdb.imdbID);
    // We have to halve the IMDb-rating, to match our 0-5 rating scale.
    expect(averageRating).toEqual(testRatingInt / 2);
  });
});

function mockReview(override) {
  return {
    id: 1,
    attributes: {
      comment: "Niice!",
      rating: 5,
      author: "Nisse",
      verified: true,
      createdAt: "2024-04-12T19:59:00.000Z",
      updatedAt: "2024-04-12T19:59:00.000Z",
      ...override,
    },
  };
}

function mockMovie() {
  return {
    id: 2,
    attributes: {
      title: "Encanto",
      imdbId: "tt2953050",
    },
  };
}

function mockImdb() {
  return {
    Title: "Encanto",
    Year: "2021",
    imdbRating: "7.2",
    imdbID: "tt2953050",
  };
}

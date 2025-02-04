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

    const apiRatingAdapter = {
      retrieveAllReviews: async () => testArray,
    };

    const averageRating = await getAverageRating(apiRatingAdapter, movieId);
    expect(testArray.length).toBeGreaterThanOrEqual(5);
    expect(averageRating).toBe((2 + 5 + 3 + 1 + 2) / 5);
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
    const testRating = parseFloat(testImdb.imdbRating);

    const apiRatingAdapter = {
      retrieveAllReviews: async () => testArray,
      retrieveImdbId: async () => testId,
      retrieveImdbRating: async () => testRating,
    };

    const averageRating = await getAverageRating(apiRatingAdapter, movieId);
    expect(testArray.length).toBeLessThan(5);
    expect(testId).toMatch(testImdb.imdbID);
    // We have to halve the IMDb-rating, to match our 0-5 rating scale.
    expect(averageRating).toBe(testRating / 2);
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

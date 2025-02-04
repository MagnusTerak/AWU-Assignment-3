import { describe, expect, it } from "@jest/globals";
import getAverageRating from "../src/getAverageRating.js";

describe("getAverageRating()", () => {
  const movieId = 1;
  it("returns an empty array", async () => {
    const cmsAdapter = {
      retrieveAllRatings: async () => [],
    };

    const rating = await getAverageRating(cmsAdapter, movieId);
    expect(rating).toHaveLength(0);
  });

  it("returns average rating, if (5 <= reviews)", async () => {
    const testArray = [
      mockReview({ rating: 2 }),
      mockReview({ rating: 5 }),
      mockReview({ rating: 3 }),
      mockReview({ rating: 1 }),
      mockReview({ rating: 2 }),
    ];

    const cmsAdapter = {
      retrieveAllRatings: async () => testArray,
    };

    const rating = await getAverageRating(cmsAdapter, movieId);
    expect(testArray.length).toBeGreaterThanOrEqual(5);
    expect(rating).toBe((2 + 5 + 3 + 1 + 2) / 5);
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

import { describe, expect, it } from "@jest/globals";
import { retrieveTopRatedMovies, retrieveReviews } from "../src/topRated.js";

describe("retrieveTopRatedMovies()", () => {
    it("returns only the top 5 rated movies even if the array contains more entries", async () => {
        const mockData = {
            data: [
                {
                    id: 1,
                    rating: 1,
                    attributes: {
                        updatedAt: '2025-01-15T10:43:33.044Z',
                    }
                },
                {
                    id: 2,
                    rating: 2,
                    attributes: {
                        updatedAt: '2025-01-15T10:43:33.044Z',
                    }
                },
                {
                    id: 3,
                    rating: 4,
                    attributes: {
                        updatedAt: '2025-01-15T10:43:33.044Z',
                    }
                },
                {
                    id: 4,
                    rating: 3,
                    attributes: {
                        updatedAt: '2025-01-15T10:43:33.044Z',
                    }
                },
                {
                    id: 5,
                    rating: 3.1,
                    attributes: {
                        updatedAt: '2025-01-15T10:43:33.044Z',
                    }
                },
                {
                    id: 6,
                    rating: 0,
                    attributes: {
                        updatedAt: '2025-01-15T10:43:33.044Z',
                    }
                },
                {
                    id: 9,
                    rating: 4.2,
                    attributes: {
                        updatedAt: '2025-01-15T10:43:33.044Z',
                    }
                }
            ]
        };

        const topRatedMovies = await retrieveTopRatedMovies(mockData);

        expect(topRatedMovies.length).toBeLessThanOrEqual(5); // Expected the length of the array to be 5 or less because it should ignore entries after 5.
    });
});

describe("retrieveReviews()", () => {
    it("ignores reviews that are older than 30 days", async () => {
        const mockData = [
            {
                id: 12,
                attributes:{ 
                    comment: 'Forest to the top!',
                    rating: 5,
                    author: 'Forest fanbase',
                    createdAt: '2025-02-08T10:58:11.509Z',
                    updatedAt: '2025-02-08T10:58:11.509Z'
                }
            },
            {
                id: 13,
                attributes:{ 
                    comment: 'Forest to the top!',
                    rating: 3,
                    author: 'Forest fanbase',
                    createdAt: '2025-01-05T10:58:11.509Z',
                    updatedAt: '2025-01-05T10:58:11.509Z'
                }
            },
            {
                id: 15,
                attributes:{ 
                    comment: 'Forest to the top!',
                    rating: 1,
                    author: 'Forest fanbase',
                    verified: true,
                    createdAt: '2021-02-08T10:58:11.509Z',
                    updatedAt: '2021-02-08T10:58:11.509Z'
                }
            }
        ];

        const { ratingOfMovie, reviewsCounted } = await retrieveReviews(null, mockData);

        expect(ratingOfMovie).toBe(5); // Only one review's rating should count because its newer then 30days so the rating should become 5
        expect(reviewsCounted).toBe(1); // Only one review passes so we expect the reviewsCounted to be only 1
    });
});
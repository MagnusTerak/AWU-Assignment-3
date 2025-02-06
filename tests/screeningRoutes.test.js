//screeningRoutes.test.js
import request from "supertest";
import express from "express";
import screeningRoutes from "../src/screeningRoutes";
import jest from 'jest-mock';

// Created an app instance to test our routes
const app = express();
app.use("/api", screeningRoutes);

// Mock fetch
global.fetch = jest.fn();

describe("GET /screenings/:movieId", () => {
    it("should return only upcoming screenings for the requested movie", async () => {
        const movieId = 1;
        const mockApiResponse = {
            data: [
                {
                    id: 1,
                    attributes: {
                        start_time: "2025-02-09T12:00:00Z",
                        movie: { data: { id: 1 } }
                    }
                },
                {
                    id: 2,
                    attributes: {
                        start_time: "2025-02-10T12:00:00Z",
                        movie: { data: { id: 1 } }
                    }
                },
                {
                    id: 3,
                    attributes: {
                        start_time: "2025-02-07T12:00:00Z",
                        movie: { data: { id: 2 } }
                    }
                }
            ]
        };

        // Mock fetch to simulate an API response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockApiResponse
        });

        const response = await request(app).get(`/api/screenings/${movieId}`);

        expect(response.status).toBe(200);

        // Expect only the two future screenings for movie 1 to be returned
        expect(response.body.length).toBe(2);
        expect(response.body[0].id).toBe(1);
        expect(response.body[1].id).toBe(2);

        // Control that fetch is called with the correct URL
        expect(fetch).toHaveBeenCalledWith(
            `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie&filters[movie]=${movieId}`
        );
    });

    it("should handle errors gracefully when fetch fails", async () => {
        const movieId = 1;
        
        // Mock fetch to simulate a network error
        fetch.mockRejectedValueOnce(new Error("Network error"));

        const response = await request(app).get(`/api/screenings/${movieId}`);

        expect(response.status).toBe(500);
        expect(response.text).toBe("Error fetching screenings: Network error");
    });
});

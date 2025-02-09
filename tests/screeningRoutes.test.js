//screeningRoutes.test.js
// Author: Tobias-hubs
import request from "supertest";
import express from "express";
import screeningRoutes from "../src/screeningRoutes";
import jest from 'jest-mock';

// Created an app instance to test our routes
const app = express();
app.use("/api", screeningRoutes);

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
    fetch.mockClear();
});

afterEach(() => {
    fetch.mockReset();
});

describe("GET /screenings/:movieId", () => {
    it("should return only upcoming screenings for the requested movie", async () => {
        const movieId = 1;
        // To avoid timezone issues in CI 
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const todayISO = today.toISOString().split("T")[0];

        const mockApiResponse = {
            data: [
                {
                    id: 1,
                    attributes: {
                        start_time: `${todayISO}T12:00:00Z`, // Screening today
                        movie: { data: { id: 1 } }
                    }
                },
                {
                    id: 2,
                    attributes: {
                        start_time: "2025-12-31T12:00:00Z", // Future Screening 
                        movie: { data: { id: 1 } }
                    }
                },
                {
                    id: 3,
                    attributes: {
                        start_time: "2023-01-01T12:00:00Z", // Old screening
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

         // Ensure date comparison works in CI
         const futureScreenings = mockApiResponse.data.filter(screening => 
            Date.parse(screening.attributes.start_time) >= Date.now() &&
            screening.attributes.movie.data.id === movieId
        );

        expect(response.body.length).toBe(futureScreenings.length);

        futureScreenings.forEach((screening, index) => {
            expect(response.body[index].id).toBe(screening.id);
        });
        
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

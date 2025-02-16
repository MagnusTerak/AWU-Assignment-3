import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('Movie Reviews Pagination', () => {
    let container;
    
    beforeEach(() => {
        // Setup DOM elements
        container = document.createElement('div');
        container.innerHTML = `
            <ul id="reviews-list"></ul>
            <button id="prev-page">Previous</button>
            <button id="next-page">Next</button>
            <div id="page-info"></div>
            <form id="review-form" data-movie-id="123"></form>
        `;
        document.body.appendChild(container);

        // Reset fetch mock
        global.fetch = jest.fn();
    });

    
    afterEach(() => {
        document.body.removeChild(container);
        jest.resetAllMocks();
    });

    test('should render reviews and update pagination for full page', async () => {
        // Mock API response with 5 reviews (full page)
        const mockReviews = {
            data: Array(5).fill().map((_, i) => ({
                attributes: {
                    rating: 4,
                    comment: `Test comment ${i}`,
                    author: `Author ${i}`
                }
            }))
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockReviews)
        });

        // Initialize the page
        require('../static/js/movieReviewsUI');

        // Wait for initial fetch to complete
        await new Promise(resolve => setTimeout(resolve, 0));

        // Check if reviews are rendered
        const reviewsList = document.getElementById('reviews-list');
        expect(reviewsList.children.length).toBe(5);

        // Check pagination state
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        expect(prevBtn.disabled).toBe(true);  // First page
        expect(nextBtn.disabled).toBe(false); // More pages possible
        expect(pageInfo.textContent).toBe('Visar 5 recensioner');
    });

    test('should handle empty reviews list', async () => {
        // Mock API response with no reviews
        const mockReviews = {
            data: []
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockReviews)
        });

        require('../static/js/movieReviewsUI');

        await new Promise(resolve => setTimeout(resolve, 0));

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        expect(prevBtn.disabled).toBe(true);
        expect(nextBtn.disabled).toBe(true);
        expect(pageInfo.textContent).toBe('Inga recensioner än');
    });

    test('should handle navigation between pages', async () => {
        // Mock first page response
        const mockFirstPage = {
            data: Array(5).fill().map((_, i) => ({
                attributes: {
                    rating: 4,
                    comment: `Page 1 comment ${i}`,
                    author: `Author ${i}`
                }
            }))
        };

        // Mock second page response
        const mockSecondPage = {
            data: Array(3).fill().map((_, i) => ({
                attributes: {
                    rating: 4,
                    comment: `Page 2 comment ${i}`,
                    author: `Author ${i}`
                }
            }))
        };

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockFirstPage)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSecondPage)
            });

        require('../static/js/movieReviewsUI');

        // Wait for initial fetch
        await new Promise(resolve => setTimeout(resolve, 0));

        // Click next page
        const nextBtn = document.getElementById('next-page');
        nextBtn.click();

        // Wait for second fetch
        await new Promise(resolve => setTimeout(resolve, 0));

        const reviewsList = document.getElementById('reviews-list');
        expect(reviewsList.children.length).toBe(3);
        
        // Check pagination state after navigation
        const prevBtn = document.getElementById('prev-page');
        expect(prevBtn.disabled).toBe(false);
        expect(nextBtn.disabled).toBe(true);
    });
}); 
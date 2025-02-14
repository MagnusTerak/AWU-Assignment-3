//excludeReviews.test.js
// Author: Tobias-hubs
import request from 'supertest';
import express from 'express';
import excludeReviews from '../src/excludeReviews.js';

const app = express();
app.use('/api', excludeReviews);

test('Exclude unverified reviews', async () => {
    const response = await request(app).get('/api/reviews?filters[movie]=1&pagination[page]=1&pagination[pageSize]=5');

    expect(response.status).toBe(200);
    response.body.data.forEach(review => {
        expect(review.attributes.verified).toBe(true);
    });
});

test('Calculate average rating of verified reviews', async () => {
    const response = await request(app).get('/api/reviews/average-rating?filters[movie]=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('averageRating');

    if (response.body.averageRating !== null) {
        expect(typeof response.body.averageRating).toBe('string');
        //Round to string
    }
});
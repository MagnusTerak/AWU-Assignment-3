import {expect, test} from '@jest/globals';
import request from 'supertest';
import { app } from "../src/app.js";


test('/Movies page should list all titles of the movies correct.', async () => {
    const response = await request(app)
        .get('/movies')
        .expect('Content-Type', /html/)
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

test('Non existing site should answer with status 404', async () => {
    const response = await request(app)
        .get('/movie/2314');

    expect(response.status).toBe(404);
    expect(response.text).toContain("Sidan du letar efter existerar inte.");
});
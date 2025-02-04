import { describe, expect, it, jest } from '@jest/globals';
import getScreenings from '../src/screenings';


/* test för hämtning av screenings som ska vara tom */
describe('getScreenings()', () => {
it ('returns empty array', async () => {
    const fakeCmsAdapter = {
        loadScreenings: async () => [],     
    }

const screenings = await getScreenings(fakeCmsAdapter);
expect(screenings).toHaveLength(0);


});
}); 


// Test för fem kommande dagar

// test för 10 visningar max, om det finns fler så ska det bara visas de dagar som 10 visningar 

//
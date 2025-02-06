import { describe, expect, it, jest } from '@jest/globals';
import getScreenings from '../src/screenings';


describe('getScreenings()', () => {

  
    // Testar att det bara är visningar för de fem kommande dagar som syns
    it('only returns screenings for the next five days', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2025, 1, 7)); 
  
  
      const fakeCmsAdapter = {
        loadScreenings: async () => [ 
          mockScreening({ start_time: "2025-02-07" }),
          mockScreening({ start_time: "2025-02-08" }),
          mockScreening({ start_time: "2025-02-09" }),
          mockScreening({ start_time: "2025-02-10" }),
          mockScreening({ start_time: "2025-02-11" }),
          mockScreening({ start_time: "2025-02-12" }),
          mockScreening({ start_time: "2025-02-13" }),
        ],
      }
  
      const screenings = await getScreenings(fakeCmsAdapter);
      expect(screenings).toHaveLength(5);
    });
  });
  
  
  function mockScreening(overrides) {
    return {
      id: 1,
      attributes: {
        start_time: "2025-02-07T00:00:00.000Z", 
        createdAt: "2025-02-05T07:36:08.919Z",
        updatedAt: "2025-02-05T07:36:08.919Z",
        ...overrides, 
      },
    }
  }


// test för 10 visningar max, om det finns fler så ska det bara visas de dagar som 10 visningar 

//
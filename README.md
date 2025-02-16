**API Dokumentation**

- Tobias
  GET /api/reviews
  filters[movie]= ID för film
  pagination[page]
  pagination[pageSize]
  GET /api/reviews/average-rating
  filters[movie]= ID för film
  GET /api/screenings/:movieId
  :movieId = ID för film
-

- Nils
  GET /movies/:id/average-rating
  id = filmens id
-

- Magnus
- Get /movies/top-rated-movies
- This returns the top 5 rated movies from the API
-

## API Dokumentation – Recensioner Jörgen

**POST /api/reviews**

- Beskrivning: Lägger till en ny recension för en film.
- URL: https://plankton-app-xhkom.ondigitalocean.app/api/reviews

### Request:

- Metod: POST
- Innehållstyp: application/json
-
- **Body:**
- comment (string) – Själva recensionstexten
- rating (number) – Betyget
- author (string) – Namnet på den som skriver recensionen
- movie (number) – ID för filmen som recenseras

* Exempel:
  ```
  {
  "comment": "Fantastisk film, rekommenderas!",
  "rating": 4,
  "author": "Rune",
  "movie": 123
  }
  ```

### Response

- Lyckad förfrågan – 201 Created:
  ```
  {
  "id": 456,
  "comment": "Fantastisk film, rekommenderas!",
  "rating": 4,
  "author": "Rune",
  "movie": 123,
  "createdAt": "2025-02-11T12:00:00Z"
  }
  ```

### Felhantering

- 400 Bad Request – Om någon parameter saknas eller har ogiltigt värde
- 500 Internal Server Error – Om något går fel på servern

* Bekhal
  GET /api/reviews
  Beskrivning: Hämtar recensioner för en specifik film + paginering, bläddring mellan recensioner/sidor.
  URL: /api/reviews

Request
Metod: GET
Query-parametrar:

- filters[movie] (obligatorisk, number) – ID för filmen vars recensioner hämtas.
- pagination[page] Anger vilken sida av recensionerna som ska hämtas (standard: 1).
  pagination[pageSize] Antal recensioner per sida (standard: 5).

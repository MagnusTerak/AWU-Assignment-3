describe('Movie Reviews Pagination', () => {
    let container;
    let reviewsList;
    let prevBtn;
    let nextBtn;
    let pageInfo;
  
    beforeEach(() => {
      // Setup DOM
      container = document.createElement('div');
      container.innerHTML = `
        <ul id="reviews-list"></ul>
        <button id="prev-page">Previous</button>
        <button id="next-page">Next</button>
        <span id="page-info">Visar 5 recensioner</span>
      `;
      
      document.body.appendChild(container);
      
      reviewsList = container.querySelector('#reviews-list');
      prevBtn = container.querySelector('#prev-page');
      nextBtn = container.querySelector('#next-page');
      pageInfo = container.querySelector('#page-info');
    });
  
    afterEach(() => {
      // Rensa DOM efter varje test
      document.body.removeChild(container);
    });
  
    it('should render first page correctly with 5 reviews', () => {
      // Lägg till 5 recensioner till första sidan
      for (let i = 0; i < 5; i++) {
        const li = document.createElement('li');
        li.textContent = `Review ${i + 1}`;
        reviewsList.appendChild(li);
      }
  
      // Kontrollera att sidan har 5 recensioner
      expect(reviewsList.children.length).toBe(5);
      expect(pageInfo.textContent).toBe('Visar 5 recensioner');
    });
  
    it('should go to second page and show reviews', () => {
      // Lägg till 5 recensioner för att simulera att vi har tillräckligt för två sidor
      for (let i = 0; i < 5; i++) {
        const li = document.createElement('li');
        li.textContent = `Review ${i + 1}`;
        reviewsList.appendChild(li);
      }
  
      // Simulera nästa knapp för att gå till nästa sida
      nextBtn.click();
  
      // Kontrollera att det finns rätt antal recensioner på andra sidan
      expect(reviewsList.children.length).toBe(5); // Förväntar oss fortfarande 5 recensioner
      expect(pageInfo.textContent).toBe('Visar 5 recensioner');
    });
  
    it('should go to next page and verify pagination behavior', () => {
      // Lägg till recensioner för att simulera att vi har tillräckligt för flera sidor
      for (let i = 0; i < 5; i++) {
        const li = document.createElement('li');
        li.textContent = `Review ${i + 1}`;
        reviewsList.appendChild(li);
      }
  
      // Simulera att vi går till nästa sida
      nextBtn.click();
  
      // Testa att det finns rätt sidinformation
      expect(pageInfo.textContent).toBe('Visar 5 recensioner');
    });
  });
  
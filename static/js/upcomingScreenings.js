async function fetchScreenings() {
  try {
    const response = await fetch('/movies/screenings');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();

    const screeningsList = document.querySelector('.upcoming-screenings__list');

    const screeningsByDate = {};

    responseData.data.forEach(screening => {
      const movieTitle = screening.attributes.movie.data.attributes.title;
      const movieImage = screening.attributes.movie.data.attributes.image.url;
      const startTime = new Date(screening.attributes.start_time);
      
      const formattedDate = startTime.toLocaleDateString('sv-SE', {
        weekday: 'long',  
        day: 'numeric',   
        month: 'long',    
      });
      
      if (!screeningsByDate[formattedDate]) {
        screeningsByDate[formattedDate] = [];
      }

      screeningsByDate[formattedDate].push({
        movieTitle,
        movieImage,
        startTime: startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }), 
      });
    });

    Object.keys(screeningsByDate).forEach(date => {
      const dateSection = document.createElement('div');
      dateSection.classList.add('date-section');
      
      const dateHeader = document.createElement('h3');
      dateHeader.textContent = date;
      dateHeader.classList.add('date-header'); 
      dateSection.appendChild(dateHeader);

      const hr = document.createElement('hr');
      hr.classList.add('hr');
      dateSection.appendChild(hr);

      const moviesRow = document.createElement('div');
      moviesRow.classList.add('movies-row');

      const screeningsForThisDate = screeningsByDate[date];
      
      screeningsForThisDate.forEach(screening => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const imageElement = document.createElement('img');
        imageElement.src = screening.movieImage;
        imageElement.alt = screening.movieTitle;
        imageElement.classList.add('movie-card__image');
        movieCard.appendChild(imageElement);

        const titleElement = document.createElement('span');
        titleElement.textContent = screening.movieTitle;
        titleElement.classList.add('movie-card__title');
        movieCard.appendChild(titleElement);

        const timeElement = document.createElement('span');
        timeElement.textContent = screening.startTime; // Nu visas endast tiden
        timeElement.classList.add('movie-card__time');
        movieCard.appendChild(timeElement);

        moviesRow.appendChild(movieCard);
      });

      dateSection.appendChild(moviesRow);
      screeningsList.appendChild(dateSection);
    });
  } catch (error) {
    console.error('Det uppstod ett fel:', error);
  }
}

fetchScreenings();

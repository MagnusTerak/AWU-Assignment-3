async function fetchScreenings() {
  try {
    const response = await fetch('/movies/screenings');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    
    const screeningsList = document.querySelector('.upcoming-screenings__list');
    
    responseData.data.forEach(screening => {
      const movieTitle = screening.attributes.movie.data.attributes.title;
      const movieImage = screening.attributes.movie.data.attributes.image.url;
      const startTime = new Date(screening.attributes.start_time).toLocaleString();
      
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      
      const imageElement = document.createElement('img');
      imageElement.src = movieImage;
      imageElement.alt = movieTitle;
      imageElement.classList.add('movie-card__image');
      movieCard.appendChild(imageElement);
      
      const titleElement = document.createElement('span');
      titleElement.textContent = movieTitle;
      titleElement.classList.add('movie-card__title');
      movieCard.appendChild(titleElement);
      
      const timeElement = document.createElement('span');
      timeElement.textContent = startTime;
      timeElement.classList.add('movie-card__time');
      movieCard.appendChild(timeElement);
      
      screeningsList.appendChild(movieCard);
    });
  } catch (error) {
    console.error('Det uppstod ett fel:', error);
  }
}

fetchScreenings();

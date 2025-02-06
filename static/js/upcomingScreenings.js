fetch('/movies/screenings')  
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();  
  })
  .then(data => {
    const screeningsList = document.querySelector('.screeningsList');
    
    data.data.forEach(screening => {
        const movieTitle = screening.attributes.movie.data.attributes.title;
        const movieImage = screening.attributes.movie.data.attributes.image.url;
        const startTime = new Date(screening.attributes.start_time).toLocaleString();
        
        
        const movieCard = document.createElement('div');
        movieCard.classList.add('movieCard'); 
        
        
        const imageElement = document.createElement('img');
        imageElement.src = movieImage;
        imageElement.alt = movieTitle;
        imageElement.classList.add('movieScreeningImage'); 
        movieCard.appendChild(imageElement); 

       
        const titleElement = document.createElement('span');
        titleElement.textContent = movieTitle;
        titleElement.classList.add('movieScreeningTitle'); 
        movieCard.appendChild(titleElement); 

        
        const timeElement = document.createElement('span');
        timeElement.textContent = startTime;
        timeElement.classList.add('movieScreeningTime'); 
        movieCard.appendChild(timeElement); 
        
        
        screeningsList.appendChild(movieCard);
    });

  })
  .catch(error => {
    console.error('Det uppstod ett fel:', error);  
  });
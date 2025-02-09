document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("/movies/top-rated-movies");
        
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        
        const movies = await response.json();
        
        for (let currentMovieIndex = 0; currentMovieIndex < movies.length; currentMovieIndex++) {
            const movie = movies[currentMovieIndex];
            
            CreateMovieCard(movie);
        }

    } catch (error) {
      console.error("Error fetching movies:", error);
    }
});

const CreateMovieCard = function(movie) {
    const container = document.querySelector(".topRatedSection__container");

    const movieElement = document.createElement("div");
    movieElement.classList.add("topRatedSection__container__card");

    container.appendChild(movieElement);
    

    const img = document.createElement("img");
    img.classList.add("topRatedSection__container__image");
    img.src = `${movie.image.url}`;

    const label = document.createElement("h3");
    label.classList.add("topRatedSection__container__label");
    label.textContent = `${movie.title}`;

    movieElement.appendChild(img);
    movieElement.appendChild(label);
}

//REVIEWLIST ON DETLAILSITE//
document.addEventListener("DOMContentLoaded", () => {
    const reviewsList = document.getElementById("reviews-list");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");
    const form = document.querySelector("#review-form");
  
    const movieId = form.getAttribute("data-movie-id");
    console.log("MovieId:", movieId); // Add this line to check the value
    let currentPage = 1;
    const pageSize = 5;
  
    // Function: Get the reviews
    async function fetchReviews(page) {
        try {
            console.log(`Fetching reviews for movie ${movieId}, page ${page}`); // Debuggar
            const url = `/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
        
            const response = await fetch(url);
            console.log('Response status:', response.status); // Debuggar
        
            const data = await response.json();
            console.log('Fetched data:', data); // Debuggar
            if (!response.ok) throw new Error("Failed to fetch reviews");
    
            renderReviews(data);
        } catch (error) {
            console.error("Kunde inte fetcha reviews:");
            reviewsList.innerHTML = "<p>Kan inte ladda reviews.</p>";
        }
    }
  
    // Function: Render in DOM
function renderReviews(data) {
    console.log('Starting to render reviews with data:', data);
    
    if (!data || !data.data || !Array.isArray(data.data)) {
        console.error('Invalid data structure:', data);
        reviewsList.innerHTML = "<p>Felaktigt dataformat från servern.</p>";
        return;
    }

    reviewsList.innerHTML = ""; // Clear list

    data.data.forEach(review => {
        const li = document.createElement("li");
        li.style.display = 'flex';
        li.style.flexDirection = 'column';

        if (!review.attributes) {
            console.error('Review missing attributes:', review);
            return;
        }

        const ratingElement = createStarRating(review.attributes.rating);
        const commentElement = document.createElement("p");
        commentElement.textContent = review.attributes.comment;
        commentElement.classList.add("comment");

        const authorElement = document.createElement("span");
        authorElement.textContent = review.attributes.author;
        authorElement.classList.add("author");

        li.appendChild(ratingElement);
        li.appendChild(commentElement);
        li.appendChild(authorElement);

        reviewsList.appendChild(li);
    });

    // Pagination
    const totalReviews = data.data.length;
    if (totalReviews === 0) {
        pageInfo.textContent = 'Inga recensioner än';
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
    } else {
        pageInfo.textContent = `Visar ${totalReviews} recensioner`;
        // Disable next button if we received fewer reviews than pageSize
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = totalReviews < pageSize;
    }
}   
  
      //Funtion: Static stars from rating api
      function createStarRating(rating) {
        const starFull = "&#9733;"; //Återanvänder Jörgens stjärnor för helhelt. Försökte återanvända logiken också men blev svårt i och med modulen är interaktiv.
        const starEmpty = "&#9734;";
        const totalStars = 5; 
  
        let stars = '';
      for (let i = 0; i < totalStars; i++) {
          if (rating > i) {
              stars += `<span class="star full" style="color: gold;">${starFull}</span>`; // Full star (guld)
          } else {
              stars += `<span class="star empty" style="color: #d3d3d3;">${starEmpty}</span>`; // Empty star (grå)
          }
      }
  
        const ratingElement = document.createElement("div");
        ratingElement.classList.add("star-rating");
        ratingElement.innerHTML = stars;
        return ratingElement;
    }
  
    // Function: Prev site
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchReviews(currentPage);
        }
    });
  
    // Function: Next side
    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        fetchReviews(currentPage);
    });
  
    // Load reviews as site loads
    fetchReviews(currentPage);
  });
  
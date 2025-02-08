const openModal = document.querySelector(".review-modal__open");
const closeModal = document.querySelector(".review-modal__close");
const form = document.querySelector("#review-form");
const responseMessage = document.getElementById("response-message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const comment = document.getElementById("comment").value;
  const author = document.getElementById("author").value;
  const password = document.getElementById("password").value;
  const movie = form.getAttribute("data-movie-id");

  const credentials = `${author}:${password}`;
  const b64credentials = btoa(credentials);

  const jwtRes = await fetch("/api/credentials", {
    method: "POST",
    headers: {
      Authorization: "Basic " + b64credentials,
    },
  });

  if (!jwtRes.ok) {
    responseMessage.textContent = "Ogiltigt användarnamn och/eller lösenord!";
    responseMessage.style.color = "red";
    return;
  }

  const jwtPayload = await jwtRes.json();
  const token = jwtPayload.token;

  const ratingInput = document.querySelector('input[name="rating"]:checked');

  if (!ratingInput) {
    responseMessage.textContent =
      "Välj ett betyg mellan 1 och 5 genom att klicka på stjärnorna!";
    responseMessage.style.color = "red";
    return;
  }

  const rating = parseInt(ratingInput.value);

  if (isNaN(rating) || rating < 0 || rating > 5) {
    responseMessage.textContent = "Betyg måste vara mellan 1 och 5!";
    responseMessage.style.color = "red";
    return;
  }

  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        comment: comment,
        rating: rating,
        author: author,
        movie: movie,
      }),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skickandet av recensionen.");
    }

    const responseData = await response.json();
    responseMessage.textContent = responseData.message;
    responseMessage.style.color = "green";
    form.reset();
  } catch (error) {
    responseMessage.textContent = "Ett fel uppstod: " + error.message;
    responseMessage.style.color = "red";
  }
});

openModal.addEventListener("click", () => {
  form.reset();
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});








//REVIEWLIST ON DETLAILSITE//

document.addEventListener("DOMContentLoaded", () => {
  const reviewsList = document.getElementById("reviews-list");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");

  const movieId = form.getAttribute("data-movie-id");
  let currentPage = 1;
  const pageSize = 5;

  // Function: Get the reviews
  async function fetchReviews(page) {
      try {
          const response = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
          const data = await response.json();

          if (!response.ok) throw new Error("Kunde inte hämta recensioner");

          renderReviews(data);
      } catch (error) {
          console.error("Fel vid hämtning av recensioner:", error);
          reviewsList.innerHTML = "<p>Kunde inte ladda recensioner.</p>";
      }
  }

  // Function: Render in DOM
  function renderReviews(data) {
      reviewsList.innerHTML = ""; // Rensa lista.

      data.data.forEach(review => {
        const li = document.createElement("li");
        li.style.display = 'flex';
        li.style.flexDirection = 'column';

    

       const ratingElement = createStarRating(review.attributes.rating); // Visa stjärnor istället för siffror, detta enligt figma design.


        const commentElement = document.createElement("p");
        commentElement.textContent = review.attributes.comment; 
        commentElement.classList.add("comment"); //Klass för styling

        const authorElement = document.createElement("span");
        authorElement.textContent = review.attributes.author; //Tredje raden är namn, skapat ny ordning på api infon enl figma.
        authorElement.classList.add("author"); // Klass för styling



        li.appendChild(ratingElement);
        li.appendChild(commentElement);
        li.appendChild(authorElement);

        reviewsList.appendChild(li);
    });
          

      //Function: Pagination
      pageInfo.textContent = `Sida ${data.meta.pagination.page} av ${data.meta.pagination.pageCount}`;
      prevPageBtn.disabled = data.meta.pagination.page === 1;  //Går ej att klicka om på första sidan.
      nextPageBtn.disabled = data.meta.pagination.page === data.meta.pagination.pageCount; //Går ej att klicka på om på sista sidan.
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


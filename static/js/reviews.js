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

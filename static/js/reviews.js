const openModal = document.querySelector(".review-modal__open");
const closeModal = document.querySelector(".review-modal__close");
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("review-form");
  const responseMessage = document.getElementById("response-message");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const comment = document.getElementById("comment").value;
    const author = document.getElementById("author").value;
    const movie = form.getAttribute("data-movie-id");

    const ratingInput = document.querySelector('input[name="rating"]:checked');

   if (!ratingInput) {
       responseMessage.textContent = "Välj ett betyg mellan 0 och 5 genom att klicka på stjärnorna!";
       responseMessage.style.color = "red";
       return;
   }

   const rating = parseInt(ratingInput.value);

   if (isNaN(rating) || rating < 0 || rating > 5) {
     responseMessage.textContent = "Betyg måste vara mellan 0 och 5!";
     responseMessage.style.color = "red";
     return;
   }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            comment: comment,
            rating: rating,
            author: author,
            movie: movie,
          })
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
});

openModal.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});

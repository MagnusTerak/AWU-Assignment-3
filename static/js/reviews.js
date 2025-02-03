const openModal = document.querySelector(".open-button");
const closeModal = document.querySelector(".close-modal-button");
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("review-form");
  const responseMessage = document.getElementById("response-message");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const comment = document.getElementById("comment").value;
    const rating = document.getElementById("rating").value;
    const author = document.getElementById("author").value;
    const movie = form.getAttribute("data-movie-id");

    const reviewData = {
      comment: comment,
      rating: parseInt(rating),
      author: author,
      movie: movie,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      console.log("ReviewData:", reviewData);

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
  location.reload();
  modal.close();
});

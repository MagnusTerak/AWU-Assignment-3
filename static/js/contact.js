import './header.js';

// Header fetch
// Fetch file from contact.json because fetch dont work when file lies in src folder
// Footer fetch

if (window.location.toString().includes("contact")) {
  fetch("/static/database/contact.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      document.querySelector(".contact-page__title").textContent = data.pageTitle;
      document.querySelector(".contact-form__label--name").textContent =
        data.form.name;
      document.querySelector(".contact-form__label--email").textContent =
        data.form.email;
      document.querySelector(".contact-form__label--phoneNumber").textContent =
        data.form.phoneNumber;
      document.querySelector(".contact-form__label--topic").textContent =
        data.form.topic;
      document.querySelector(".contact-form__label--message").textContent =
        data.form.message;
      document.querySelector(".contact-form__button").textContent =
        data.form.submitButton;

      // Start validation after JSON is loaded
      setupValidation(data.form.validation);
    })
    .catch((error) => {
      console.error("Error loading contact data:", error);
    });

  const setupValidation = (validationMessages) => {
    const form = document.getElementById("contactForm");
    const submitButton = document.getElementById("submitButton");

    //Fields and messages
    const fields = [
      { id: "name", errorId: "nameError", message: validationMessages.name },
      { id: "email", errorId: "emailError", message: validationMessages.email },
      {
        id: "phoneNumber",
        errorId: "phoneNumberError",
        message: validationMessages.phoneNumber,
      },
      { id: "topic", errorId: "topicError", message: validationMessages.topic },
      {
        id: "message",
        errorId: "messageError",
        message: validationMessages.message,
      },
    ];

    const visitedFields = new Set();

    const validateField = (field) => {
      const input = document.getElementById(field.id);
      const error = document.getElementById(field.errorId);

      error.textContent = "";
      input.classList.remove("invalid");
      error.classList.remove("visible");

      if (field.id === "email" && input.value.trim() !== "") { 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) { 
          error.textContent = validationMessages.email; 
          error.classList.add("visible");
          input.classList.add("invalid");
          return false; 
        }
      }

      if (field.id === "phoneNumber" && input.value.trim() !== "") {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(input.value.trim())) {
          error.textContent = validationMessages.phoneNumber;
          error.classList.add("visible");
          input.classList.add("invalid");
          return false;
        }
      }

      if (!input.value.trim()) {
        error.textContent = field.message;
        error.classList.add("visible");
        input.classList.add("invalid");
        return false;
      }
        return true;
      
    };

    const validateForm = () => {
      let isValid = true;
      fields.forEach((field) => {
        if (!visitedFields.has(field.id)) return;  //
        if (!validateField(field)) {
          isValid = false;
        }
      });
      submitButton.disabled = !isValid;
      return isValid; //
    };

    form.addEventListener("input", validateForm);
    // Show errormessage when user leave field
    fields.forEach((field) => {
      const input = document.getElementById(field.id);
      const error = document.getElementById(field.errorId);

      input.addEventListener("blur", () => {
        visitedFields.add(field.id);
        if (!input.value.trim()) {
          error.textContent = field.message;
          error.classList.add("visible");
          input.classList.add("invalid");
        } else { 
          error.textContent = "";
          error.classList.remove("visible");
          input.classList.remove("invalid");  //
        }
        validateForm();
      });
    });


    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;
    
      fields.forEach((field) => visitedFields.add(field.id));
    
      fields.forEach((field) => {
        if (!validateField(field)) {
          isValid = false;
        }
      });
    
      if (isValid) {
        
        const successMessage = document.createElement("div");
        successMessage.textContent = "Formuläret har skickats!";
        successMessage.classList.add("success-message");
    
      
        const existingMessage = document.querySelector(".success-message");
        if (existingMessage) {
          existingMessage.remove();
        }
    
        form.appendChild(successMessage);
    
        
        form.reset();
        visitedFields.clear();
        validateForm(); 
      }
    });
    
  
    window.addEventListener("DOMContentLoaded", () => {
      submitButton.disabled = true;
  });}
}

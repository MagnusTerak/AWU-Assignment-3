export async function loadNavbar() {
  try {
    const response = await fetch("/static/database/nav.json");
    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const data = await response.json();

    const language = "sv";
    const navItems = data.NavItems[language];

    const navBar = document.createElement("nav");
    const ul = document.createElement("ul");

    navItems.forEach((item) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.name;

      li.appendChild(link);
      ul.appendChild(li);
    });

    navBar.appendChild(ul);
    document.querySelector(".header__container").prepend(navBar);

    const navButton = document.createElement("img");
    navButton.classList.add("nav__button");
    navButton.src = "/static/images/sliders/hamburger.png";
    navButton.alt = "button for navbar";

    document.querySelector(".header__container").prepend(navButton);

    navButton.addEventListener("click", function () {
      navBar.classList.toggle("navbar__visible");
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

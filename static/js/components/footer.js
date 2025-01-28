import { fetchData } from "../helpers/fetchDataHelper.js";

export async function createFooter() {

  const data = await fetchData("/static/database/footer.json");

  if (!data) {
    console.error("Invalid data not found");
    return;
  }
  // Skapa footer-elementet
  const footer = document.createElement("footer");
  // const footer = document.querySelector("footer");

  // Skapa footer__screen
  const footerScreen = document.createElement("div");
  footerScreen.className = "footer__screen";
  const screenImg = document.createElement("img");
  screenImg.src = "/static/images//filmduk.png";
  screenImg.alt = "Illustration of a screen";
  footerScreen.appendChild(screenImg);
  footer.appendChild(footerScreen);

  // Skapa footer__seats
  const footerSeats = document.createElement("div");
  footerSeats.className = "footer__seats";
  const seatsImg = document.createElement("img");
  seatsImg.src = "/static/images//stolar.png";
  seatsImg.alt = "Illustration of a movie theater";
  footerSeats.appendChild(seatsImg);
  footer.appendChild(footerSeats);

  // Skapa footer__links
const footerLinks = document.createElement("div");
    footerLinks.className = "footer__links";
    footer.appendChild(footerLinks);
  data.sections.forEach((section) => {
  
    const ul = document.createElement("ul");
    ul.className = `footer__link__list`;

    const title = document.createElement("h3");
    title.className = "footer__link-title";
    title.textContent = section.title;
    ul.appendChild(title);

    section.links.forEach((link) => {
      const li = document.createElement("li");
      li.className = "footer__link__item";

      const a = document.createElement("a");
      a.href = link.url;
      a.textContent = link.text;
      a.className = "footer__link__link";

      li.appendChild(a);
      ul.appendChild(li);
    });

    footerLinks.appendChild(ul);
  });

  document.body.appendChild(footer);
}

createFooter();

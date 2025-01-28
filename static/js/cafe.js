import { fetchData } from './helpers/fetchDataHelper.js';
import { setupScrollAnimation } from './helpers/animations/listScrollAnimation.js';
import {
  currentLanguage,
  createLanguageToggleBtn,
} from './components/languageToggleBtn.js';
import './components/footer.js';
import './header.js';


const menuContainer = document.querySelector('#cafe-menu-container');

const loadMenuItems = async (menu, language) => {
  menuContainer.innerHTML = '';

  const snacksSection = document.createElement('section');
  snacksSection.className = 'menu-section snacks-section';

  const snacksTitle = document.createElement('h2');
  snacksTitle.className = 'menu-section__title menu-section__title-snacks';
  snacksTitle.textContent = language === 'sv' ? 'Snacks' : 'Snacks';
  snacksSection.appendChild(snacksTitle);

  const snacksList = document.createElement('ul');
  snacksList.className = 'cafe-menu__list cafe-menu__List__snacks';

  menu.snacks.forEach((item) => {
    const menuItem = document.createElement('li');
    menuItem.className = 'cafe-menu__item cafe-menu__List__snacks-item';
    menuItem.textContent = `${item.name[language]}`;

    const menuItemPrice = document.createElement('span');
    menuItemPrice.textContent = `${item.price} SEK`;

    menuItem.appendChild(menuItemPrice);

    snacksList.appendChild(menuItem);
  });

  const beveragesSection = document.createElement('section');
  beveragesSection.className = 'menu-section beverages-section';

  const beveragesTitle = document.createElement('h2');
  beveragesTitle.className =
    'menu-section__title menu-section__title-beverages';
  beveragesTitle.textContent = language === 'sv' ? 'Drycker' : 'Beverages';
  beveragesSection.appendChild(beveragesTitle);

  const beveragesList = document.createElement('ul');
  beveragesList.className = 'cafe-menu__list cafe-menu__List__beverages';

  menu.beverages.forEach((item) => {
    const menuItem = document.createElement('li');
    menuItem.className = 'cafe-menu__item cafe-menu__List__bevrages-item';
    menuItem.textContent = `${item.name[language]} `;

    const menuItemPrice = document.createElement('span');
    menuItemPrice.textContent = `${item.price} SEK`;

    menuItem.appendChild(menuItemPrice);
    beveragesList.appendChild(menuItem);
  });

  snacksSection.appendChild(snacksList);
  beveragesSection.appendChild(beveragesList);

  menuContainer.appendChild(snacksSection);
  menuContainer.appendChild(beveragesSection);
  setupScrollAnimation('li');
};
const loadCafeMenu = async (language) => {
  const data = await fetchData("/static/database/cafeMenu.json");

  if (data && data.menu) {
    loadMenuItems(data.menu, language);
  } else {
    console.error('Failed to load cafe menu data.');
    return [];
  }
};
document.addEventListener('DOMContentLoaded', (content) => {
  if (window.location.toString().includes("cafe")) {
    const cafeMenu = document.querySelector(".cafe-menu");
    const cafeMenuContainer = document.createElement('div');
    cafeMenuContainer.id = 'cafe-menu-container';
    document.body.appendChild(cafeMenuContainer);
  
    loadCafeMenu(currentLanguage);
  
    const languageToggleBtn = createLanguageToggleBtn(
      currentLanguage,
      (newLanguage) => {
        loadCafeMenu(newLanguage);
      },
    );

    languageToggleBtn.style.float = "right";
  
    cafeMenu.prepend(languageToggleBtn);
  } 
});

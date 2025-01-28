import { createLogo } from "./stripes.js";
import { loadNavbar } from'./nav.js';

export function createHeader() {
  createLogo();
  loadNavbar();

}

createHeader();

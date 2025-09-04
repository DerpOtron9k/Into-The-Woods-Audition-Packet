import { initializeUI } from './ui.js';
import { FormValidator } from './validator.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  const validator = new FormValidator();
  validator.init();
});

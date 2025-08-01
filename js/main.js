import { searchInputElement, searchButtonElement, handleSearch, toggleAllList, showAllBtn } from './ui.js';
import { loadGuests } from "./data-loader.js";
import { renderTablePlan } from './table-plan.js';
import { langManager } from "../i18n/language-manager.js";

function autoSearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchInputElement.value = q;
    handleSearch();
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded');
  addOnClickEventForSettingLanguages();
  await loadGuests();
  autoSearchFromURL();
  await renderTablePlan();
  langManager.updateContent();
});

searchButtonElement.addEventListener('click', handleSearch);
searchInputElement.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
showAllBtn.addEventListener('click', toggleAllList);

function addOnClickEventForSettingLanguages() {
  document.querySelectorAll('.language-switcher button').forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      langManager.setLanguage(lang);
    });
  });
}
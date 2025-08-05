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
  langManager.updateLanguageSelectorValue();
  langManager.updateContent();
  addOnClickEventForSettingLanguages();
  await renderTablePlan();
  await loadGuests();
  autoSearchFromURL();
});

searchButtonElement.addEventListener('click', handleSearch);
searchInputElement.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
showAllBtn.addEventListener('click', toggleAllList);

function addOnClickEventForSettingLanguages() {
  const selector = document.getElementById('language-selector');
  selector.addEventListener('click', () => {
    const lang = selector.value;
    langManager.setLanguage(lang);
  });
}
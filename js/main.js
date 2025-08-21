import { searchInputElement, searchButtonElement, handleSearch } from './ui.js';
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

function addOnClickEventForSettingLanguages() {
  const select = document.querySelector('#language-selector');
  if (!select) return;

  select.addEventListener('change', () => {
    const lang = select.value;
    langManager.setLanguage(lang);
  });
}
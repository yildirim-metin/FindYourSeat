import {searchInputElement, searchButtonElement, handleSearch, toggleAllList, showAllBtn} from './ui.js';
import { loadGuests } from "./data-loader.js";
import { renderTablePlan } from './table-plan.js';

function autoSearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchInputElement.value = q;
    handleSearch();
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadGuests();
  autoSearchFromURL();
  renderTablePlan();
});

searchButtonElement.addEventListener('click', handleSearch);
searchInputElement.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
showAllBtn.addEventListener('click', toggleAllList);
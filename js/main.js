import {inputEl, btnEl, handleSearch, toggleAllList, showAllBtn} from './ui.js';
import { loadGuests } from "./data-loader.js";
import { renderTables } from './table-plan.js';

function autoSearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    inputEl.value = q;
    handleSearch();
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadGuests();
  autoSearchFromURL();
  renderTables();
});

btnEl.addEventListener('click', handleSearch);
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
showAllBtn.addEventListener('click', toggleAllList);
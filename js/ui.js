import { normalize, matchesGuest } from "./utils.js";
import { GUESTS } from "./data-loader.js";
import { renderTablePlan } from "./table-plan.js";
import { langManager } from "../i18n/language-manager.js";
import { appState } from "../utils/app-state.js";

// ======== DOM refs ========
export const searchInputElement = document.getElementById('search-input');
export const searchButtonElement = document.getElementById('search-btn');
export const searchResultsElement = document.getElementById('results');

export function handleSearch() {
  const q = searchInputElement.value;
  const qNorm = normalize(q);
  if (!qNorm) {
    showMessage("Tapez votre nom dans la barre ci-dessus.");
    return;
  }
  const matches = GUESTS.filter(g => matchesGuest(g, qNorm));
  renderMatches(matches, q);
}

export function showMessage(msg) {
  searchResultsElement.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = msg;
  searchResultsElement.appendChild(div);
}

function renderMatches(matches, rawQuery) {
  searchResultsElement.innerHTML = '';
  if (!matches.length) {
    showMessage(`Aucun invité trouvé pour "${rawQuery}". Vérifiez l'orthographe.`);
    return;
  }
  if (matches.length === 1) {
    renderGuestCard(matches[0], true);
    return;
  }
  
  const p = document.createElement('p');
  p.className = 'message';
  p.textContent = `${matches.length} résultats. Cliquez sur votre nom :`;
  searchResultsElement.appendChild(p);
  matches.forEach(m => renderGuestCard(m, false));
}

function renderGuestCard(guest, highlight=false) {
  const div = document.createElement('div');
  div.className = 'result-card' + (highlight ? ' result-highlight' : '');
  div.tabIndex = 0;
  div.setAttribute('role', 'button');
  div.addEventListener('click', () => showGuestTable(guest));
  div.addEventListener('keypress', e => { if (e.key === 'Enter' || e.key === ' ') showGuestTable(guest); });

  const h2 = document.createElement('h2');
  h2.textContent = guest.fullName();
  const p = document.createElement('p');
  p.id = "p-table-part";
  p.innerHTML = langManager.buildTablePartText(guest.table);
  appState.tableNumber = guest.table;

  div.appendChild(h2);
  div.appendChild(p);
  searchResultsElement.appendChild(div);
}

function showGuestTable(guest) {
  searchResultsElement.innerHTML = '';
  
  const guestCard = document.createElement('div');
  guestCard.id = 'guest-card';
  guestCard.className = 'result-card result-highlight';

  const guestInfo = document.createElement('h2');
  guestInfo.textContent = guest.fullName();

  guestCard.appendChild(guestInfo);
  
  searchResultsElement.appendChild(guestCard);
  appState.tableNumber = guest.table;
  renderOtherGuestOfTable(guest);
  
  renderTablePlan(guest.table);
}

function renderOtherGuestOfTable(guest) {
  const otherGuests = GUESTS.filter(g => 
    g.table === guest.table
    && (g.name != guest.name || guest.name == '')
    && g.surname != guest.surname);

  appState.otherGuests = otherGuests;

  const tableInfo = document.createElement('p');
  tableInfo.id = "table-info";
  tableInfo.innerHTML = langManager.buildTableInfoText(guest.table, otherGuests);

  const guestCard = document.getElementById('guest-card');
  guestCard.appendChild(tableInfo);
}
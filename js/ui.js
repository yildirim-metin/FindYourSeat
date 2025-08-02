import { normalize, matchesGuest } from "./utils.js";
import { GUESTS } from "./data-loader.js";
import { renderTablePlan } from "./table-plan.js";
import { langManager } from "../i18n/language-manager.js";

// ======== DOM refs ========
export const searchInputElement = document.getElementById('search-input');
export const searchButtonElement = document.getElementById('search-btn');
export const searchResultsElement = document.getElementById('results');
export const showAllBtn = document.getElementById('show-all-btn');
export const allListWrapper = document.getElementById('all-list-wrapper');

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
  p.textContent = `Table ${guest.table ?? '?'}`;

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
  renderOtherGuestOfTable(guest);

  renderTablePlan(guest.table);
}

export function toggleAllList() {
  if (allListWrapper.classList.contains('hidden')) {
    renderAllList();
    allListWrapper.classList.remove('hidden');
    showAllBtn.textContent = 'Masquer la liste';
  } else {
    allListWrapper.classList.add('hidden');
    showAllBtn.textContent = 'Voir la liste complète (organisateurs)';
  }
}

function renderAllList() {
  allListWrapper.innerHTML = '';
  if (!GUESTS.length) {
    allListWrapper.textContent = 'Aucune donnée.';
    return;
  }
  const tbl = document.createElement('table');
  tbl.className = 'all-list-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Prénom (femme)</th>
      <th>Nom (homme)</th>
      <th>Table</th>
    </tr>`;
  tbl.appendChild(thead);

  const tbody = document.createElement('tbody');
  const sorted = [...GUESTS].sort((a,b) => {
    const ap = normalize(a.surname), bp = normalize(b.surname);
    if (ap < bp) return -1; if (ap > bp) return 1;
    return 0;
  });
  sorted.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${g.surname ?? ''}</td>
      <td>${g.name ?? ''}</td>
      <td>${g.table ?? ''}</td>`;
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  allListWrapper.appendChild(tbl);
}

function renderOtherGuestOfTable(guest) {
  const otherGuests = GUESTS.filter(g => 
    g.table === guest.table
    && g.name != guest.name
    && g.surname != guest.surname);

  let otherGuestsInfo = `<strong>${otherGuests[0].fullName()}</strong>`;
  
  let i = 1;
  while (i < otherGuests.length) {
    otherGuestsInfo = `${otherGuestsInfo}, <strong>${otherGuests[i].fullName()}</strong>`;
    i++;
  }

  const tableInfo = document.createElement('p');
  tableInfo.innerHTML = langManager.buildTableInfoText(guest.table, otherGuests);

  const guestCard = document.getElementById('guest-card');
  guestCard.appendChild(tableInfo);
}
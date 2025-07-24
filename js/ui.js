import { normalize, matchesGuest } from "./utils.js";
import { GUESTS } from "./data-loader.js";
import { renderTables } from "./table-plan.js";

// ======== DOM refs ========
export const inputEl = document.getElementById('search-input');
export const btnEl = document.getElementById('search-btn');
export const resultsEl = document.getElementById('results');
export const showAllBtn = document.getElementById('show-all-btn');
export const allListWrapper = document.getElementById('all-list-wrapper');

export function handleSearch() {
  const q = inputEl.value;
  const qNorm = normalize(q);
  if (!qNorm) {
    showMessage("Tapez votre nom dans la barre ci-dessus.");
    return;
  }
  const matches = GUESTS.filter(g => matchesGuest(g, qNorm));
  renderMatches(matches, q);
}

export function showMessage(msg) {
  resultsEl.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = msg;
  resultsEl.appendChild(div);
}

function renderMatches(matches, rawQuery) {
  resultsEl.innerHTML = '';
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
  resultsEl.appendChild(p);
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
  h2.textContent = guest.prenom || '(Invité)';
  const p = document.createElement('p');
  p.textContent = `Table ${guest.table ?? '?'}${guest.place ? ` • Place ${guest.place}` : ''}`;

  div.appendChild(h2);
  div.appendChild(p);
  resultsEl.appendChild(div);
}

function showGuestTable(guest) {
  resultsEl.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'result-card result-highlight';

  const h2 = document.createElement('h2');
  h2.textContent = guest.prenom;

  const p = document.createElement('p');
  p.innerHTML = `Tu es à <strong>Table ${guest.table ?? '?'}${guest.place ? `</strong>, place <strong>${guest.place}` : ''}</strong>.`;

  div.appendChild(h2);
  div.appendChild(p);
  resultsEl.appendChild(div);

  div.scrollIntoView({ behavior: 'smooth', block: 'center' });

  console.log('showGuestTable: ', guest.table);
  renderTables(guest.table);
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
  thead.innerHTML = '<tr><th>Prénom</th><th>Table</th><th>Place</th></tr>';
  tbl.appendChild(thead);

  const tbody = document.createElement('tbody');
  const sorted = [...GUESTS].sort((a,b) => {
    const ap = normalize(a.prenom), bp = normalize(b.prenom);
    if (ap < bp) return -1; if (ap > bp) return 1;
    return 0;
  });
  sorted.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${g.prenom ?? ''}</td><td>${g.table ?? ''}</td><td>${g.place ?? ''}</td>`;
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  allListWrapper.appendChild(tbl);
}
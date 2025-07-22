/* --------------------------------------------------
 * Plan de Table Mariage - script.js
 * --------------------------------------------------
 * - Charge guests.json
 * - Normalise texte (accents, casse)
 * - Recherche par nom/prénom (inclusif)
 * - Gère affichage 0/1/n résultats
 * - Liste complète pour organisateurs
 * -------------------------------------------------- */

// ======== Utils ========
function normalize(str) {
  return (str || "")
    .normalize("NFD")               // sépare accents
    .replace(/\p{Diacritic}+/gu, "") // retire accents
    .toLowerCase()
    .trim();
}

function fullName(g) {
  return `${g.prenom ?? ''} ${g.nom ?? ''}`.trim();
}

function matchesGuest(guest, queryNorm) {
  const fn = normalize(fullName(guest));
  const pren = normalize(guest.prenom);
  const nom = normalize(guest.nom);
  return fn.includes(queryNorm) || pren.includes(queryNorm) || nom.includes(queryNorm);
}

// ======== DOM refs ========
const inputEl = document.getElementById('search-input');
const btnEl = document.getElementById('search-btn');
const resultsEl = document.getElementById('results');
const showAllBtn = document.getElementById('show-all-btn');
const allListWrapper = document.getElementById('all-list-wrapper');

let GUESTS = [];
let DATA_LOADED = false;

// ======== Fetch data ========
async function loadGuests() {
  try {
    const res = await fetch('guests.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('JSON racine doit être un tableau.');
    GUESTS = data;
    DATA_LOADED = true;
  } catch (err) {
    console.error('Erreur chargement guests.json', err);
    showMessage("Impossible de charger la liste des invités. Prévenez l'organisation.");
  }
}

// ======== Recherche ========
function handleSearch() {
  const q = inputEl.value;
  const qNorm = normalize(q);
  if (!qNorm) {
    showMessage("Tapez votre nom dans la barre ci-dessus.");
    return;
  }
  const matches = GUESTS.filter(g => matchesGuest(g, qNorm));
  renderMatches(matches, q);
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
  // Plusieurs résultats
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
  h2.textContent = fullName(guest) || '(Invité)';
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
  h2.textContent = fullName(guest);

  const p = document.createElement('p');
  p.innerHTML = `Tu es à <strong>Table ${guest.table ?? '?'}${guest.place ? `</strong>, place <strong>${guest.place}` : ''}</strong>.`;

  div.appendChild(h2);
  div.appendChild(p);
  resultsEl.appendChild(div);

  // Optionnel : faire défiler vers le résultat
  div.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ======== Messages ========
function showMessage(msg) {
  resultsEl.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = msg;
  resultsEl.appendChild(div);
}

// ======== Liste complète (organisateurs) ========
function toggleAllList() {
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
  thead.innerHTML = '<tr><th>Prénom</th><th>Nom</th><th>Table</th><th>Place</th></tr>';
  tbl.appendChild(thead);

  const tbody = document.createElement('tbody');
  const sorted = [...GUESTS].sort((a,b) => {
    const an = normalize(a.nom), bn = normalize(b.nom);
    if (an < bn) return -1; if (an > bn) return 1;
    const ap = normalize(a.prenom), bp = normalize(b.prenom);
    if (ap < bp) return -1; if (ap > bp) return 1;
    return 0;
  });
  sorted.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${g.prenom ?? ''}</td><td>${g.nom ?? ''}</td><td>${g.table ?? ''}</td><td>${g.place ?? ''}</td>`;
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  allListWrapper.appendChild(tbl);
}

// ======== URL param auto-recherche (?q=Nom) ========
function autoSearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    inputEl.value = q;
    handleSearch();
  }
}

// ======== Init ========
window.addEventListener('DOMContentLoaded', async () => {
  await loadGuests();
  autoSearchFromURL();
});

btnEl.addEventListener('click', handleSearch);
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
showAllBtn.addEventListener('click', toggleAllList);
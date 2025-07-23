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
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function matchesGuest(guest, queryNorm) {
  const pren = normalize(guest.prenom);
  return pren.includes(queryNorm);
}

// ======== DOM refs ========
const inputEl = document.getElementById('search-input');
const btnEl = document.getElementById('search-btn');
const resultsEl = document.getElementById('results');
const showAllBtn = document.getElementById('show-all-btn');
const allListWrapper = document.getElementById('all-list-wrapper');

let GUESTS = [];
let DATA_LOADED = false;

// Parse CSV "à la main"
function parseCSV(text) {
  text = text.replace(/^\uFEFF/, ''); // enlève BOM
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) {
    console.log('empty parsing csv !!');
    return [];
  }

  const headers = lines.shift().split(',').map(h => h.trim());

  const iPrenom = headers.findIndex(h => h.toLowerCase().includes('pr'));
  const iConfirm = headers.findIndex(h => h.toLowerCase().includes('confirm'));
  const iTable = headers.findIndex(h => h.toLowerCase().includes('table'));

  return lines.map(line => {
    const cols = line.split(',');
    const confirmeRaw = (cols[iConfirm] || '').trim().toLowerCase();
    return {
      prenom:  (cols[iPrenom] || '').trim(),
      confirme: confirmeRaw === 'confirmé',
      table:   (cols[iTable] || '').trim(),
    };
  });
}

// ======== Fetch data ========
async function loadGuests() {
  try {
    const res = await fetch('guests.csv', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    GUESTS = parseCSV(text)
      .filter(g => g.confirme)
      .map(g => ({ prenom: g.prenom, table: g.table || '?' }));

    DATA_LOADED = true;
  } catch (err) {
    console.error('Erreur chargement guests.csv', err);
    showMessage("Impossible de charger la liste des invités.");
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
import { parseCSV } from "./csv-parser.js";
import { showMessage } from "./ui.js";

export let GUESTS = [];
export let DATA_LOADED = false;

export async function loadGuests() {
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

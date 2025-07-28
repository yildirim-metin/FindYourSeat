import { parseCSV } from "./csv-parser.js";
import { showMessage } from "./ui.js";

export let GUESTS = [];

export async function loadGuests() {
  try {
    const res = await fetch('guests.csv', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    GUESTS = parseCSV(text).filter(g => g.hasConfirmed);
  } catch (err) {
    console.error('Erreur chargement guests.csv', err);
    showMessage("Impossible de charger la liste des invités.");
  }
}

import { Guest } from "./models/guest.js";

export function parseCSV(text) {
  text = text.replace(/^\uFEFF/, ''); // enlève BOM
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return [];
  }

  const headers = lines.shift().split(';').map(h => h.trim());

  const iSurname = headers.findIndex(h => h.toLowerCase() === 'prénom');
  const iName = headers.findIndex(h => h.toLowerCase() === 'nom');
  const iConfirm = headers.findIndex(h => h.toLowerCase() === 'confirmé');
  const iTable = headers.findIndex(h => h.toLowerCase() === 'table');

  return lines.map(line => {
    const cols = line.split(';');
    const hasConfirmedRaw = (cols[iConfirm] || '').trim().toLowerCase();
    return new Guest(
      (cols[iSurname] || '').trim(),
      (cols[iName] || '').trim(),
      hasConfirmedRaw === 'confirmé' || hasConfirmedRaw === 'en attente',
      (cols[iTable] || '').trim());
  });
}

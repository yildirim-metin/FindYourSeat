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
    const confirmeRaw = (cols[iConfirm] || '').trim().toLowerCase();
    return {
      surname:  (cols[iSurname] || '').trim(),
      name: (cols[iName] || '').trim(),
      hasConfirmed: confirmeRaw === 'confirmé' || confirmeRaw === 'en attente',
      table: (cols[iTable] || '').trim(),
    };
  });
}

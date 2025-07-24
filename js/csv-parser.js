export function parseCSV(text) {
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

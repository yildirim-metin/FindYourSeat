function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function matchesGuest(guest, queryNorm) {
  const surname = normalize(guest.prenom);
  return surname.includes(queryNorm);
}

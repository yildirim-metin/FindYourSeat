export function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function matchesGuest(guest, queryNorm) {
  const surname = normalize(guest.surname);
  const name = normalize(guest.name);
  return surname.includes(queryNorm) || name.includes(queryNorm);
}

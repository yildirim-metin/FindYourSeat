function autoSearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    inputEl.value = q;
    handleSearch();
  }
}

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
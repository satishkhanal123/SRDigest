/* ═══════════════════════════════════════
   SEARCH — autocomplete for stories
   ═══════════════════════════════════════ */

const Search = (() => {
  let input, list, debounceTimer;
  let currentResults = [];
  let selectedIndex = -1;

  function init() {
    input = document.getElementById('searchInput');
    list  = document.getElementById('autocompleteList');
    if (!input || !list) return;

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeyDown);
    input.addEventListener('focus', () => { if (currentResults.length) showList(); });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) hideList();
    });
  }

  function onInput() {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 2) { hideList(); return; }

    debounceTimer = setTimeout(async () => {
      const stories = await API.getStories();
      const cached = Cache.getArticles();
      const all = [...stories, ...cached];

      currentResults = all
        .filter(s => s.title.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6);

      renderList();
    }, 250);
  }

  function renderList() {
    if (!currentResults.length) { hideList(); return; }
    list.innerHTML = currentResults
      .map((r, i) => `<li role="option" data-index="${i}" aria-selected="${i === selectedIndex}">${escapeHtml(r.title)}</li>`)
      .join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');

    list.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => select(parseInt(li.dataset.index, 10)));
    });
  }

  function onKeyDown(e) {
    if (list.hidden) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
      renderList();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      renderList();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) select(selectedIndex);
    } else if (e.key === 'Escape') {
      hideList();
    }
  }

  function select(index) {
    const item = currentResults[index];
    if (!item) return;
    input.value = item.title;
    hideList();
    // Scroll to featured story and load this story
    const featured = document.getElementById('featuredStory');
    if (featured) {
      featured.innerHTML = `
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
        <p class="meta">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      `;
      featured.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    Cache.saveArticle(item);
  }

  function showList() {
    if (currentResults.length) list.hidden = false;
  }

  function hideList() {
    list.hidden = true;
    selectedIndex = -1;
    input.setAttribute('aria-expanded', 'false');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { init };
})();

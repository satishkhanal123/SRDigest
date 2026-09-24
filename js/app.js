/* ═══════════════════════════════════════
   APP — main entry point
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Init accessibility (font size, contrast, TTS)
  Accessibility.init();

  // Init search
  Search.init();

  // Drawer
  initDrawer();

  // Clear cache button
  document.getElementById('clearCache')?.addEventListener('click', () => {
    Cache.clearAll();
    alert('Saved articles cleared.');
  });

  // Load content
  await loadAllContent();
});

/* ── Drawer logic ── */
function initDrawer() {
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('sidebar');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('closeDrawer');

  function open() {
    drawer.classList.add('open');
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('open'));
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }
  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    setTimeout(() => { overlay.hidden = true; }, 300);
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });

  // Close drawer when a nav link is clicked
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ── Load all content in parallel ── */
async function loadAllContent() {
  const [quote, joke, health, advice, stories] = await Promise.all([
    API.getQuote(),
    API.getJoke(),
    API.getHealthTip(),
    API.getAdvice(),
    API.getStories()
  ]);

  renderQuote(quote);
  renderJoke(joke);
  renderHealth(health);
  renderAdvice(advice);
  renderFeatured(stories[0]);
  renderRelated(Cache.getArticles());
}

/* ── Renderers ── */

function renderQuote(q) {
  const el = document.getElementById('quoteCard');
  el.innerHTML = `
    <p>“${escapeHtml(q.content)}”</p>
    <p class="meta">— ${escapeHtml(q.author)}</p>
  `;
}

function renderJoke(j) {
  const el = document.getElementById('jokeCard');
  if (j.setup && j.delivery) {
    el.innerHTML = `
      <p><strong>${escapeHtml(j.setup)}</strong></p>
      <p>${escapeHtml(j.delivery)}</p>
    `;
  } else {
    el.innerHTML = `<p>${escapeHtml(j.text)}</p>`;
  }
}

function renderHealth(h) {
  const el = document.getElementById('healthCard');
  el.innerHTML = `
    <h3>${escapeHtml(h.title)}</h3>
    <p>${escapeHtml(h.text)}</p>
  `;
}

function renderAdvice(a) {
  const el = document.getElementById('adviceCard');
  el.innerHTML = `<p>${escapeHtml(a.text)}</p>`;
}

function renderFeatured(story) {
  if (!story) return;
  const el = document.getElementById('featuredStory');
  el.innerHTML = `
    <h3>${escapeHtml(story.title)}</h3>
    <p>${escapeHtml(story.body)}</p>
    <p class="meta">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
  `;
  Cache.saveArticle(story);
}

function renderRelated(articles) {
  const grid = document.getElementById('relatedGrid');
  if (!articles.length) {
    grid.innerHTML = `<p>Read today’s story, joke, and tips above.</p>`;
    return;
  }
  grid.innerHTML = articles
    .slice(0, 3)
    .map(a => `
      <div class="related-card">
        <h4>${escapeHtml(a.title)}</h4>
        <p>${escapeHtml((a.body || '').slice(0, 100))}…</p>
      </div>
    `)
    .join('');
}

/* ── Utility ── */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

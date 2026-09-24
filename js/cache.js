/* ═══════════════════════════════════════
   CACHE — localStorage with TTL & max size
   ═══════════════════════════════════════ */

const Cache = (() => {
  const PREFIX = 'gr_';
  const MAX_ARTICLES = 5;

  function set(key, value, ttlMinutes = 60) {
    const item = {
      data: value,
      expiry: Date.now() + ttlMinutes * 60 * 1000
    };
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(item));
    } catch (e) {
      // Storage full — remove oldest articles
      pruneArticles();
      try { localStorage.setItem(PREFIX + key, JSON.stringify(item)); } catch (_) {}
    }
  }

  function get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(PREFIX + key);
        return null;
      }
      return item.data;
    } catch { return null; }
  }

  function remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  function clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }

  /* ── Article cache (last 5) ── */
  function saveArticle(article) {
    const list = get('articles') || [];
    const filtered = list.filter(a => a.id !== article.id);
    filtered.unshift(article);
    set('articles', filtered.slice(0, MAX_ARTICLES), 24 * 60);
  }

  function getArticles() {
    return get('articles') || [];
  }

  function pruneArticles() {
    const list = get('articles') || [];
    if (list.length > MAX_ARTICLES) {
      set('articles', list.slice(0, MAX_ARTICLES), 24 * 60);
    }
  }

  return { set, get, remove, clearAll, saveArticle, getArticles };
})();

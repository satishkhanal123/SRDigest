/* ═══════════════════════════════════════
   API — fetch content from free public APIs
   Falls back to sample data on failure.
   ═══════════════════════════════════════ */

const API = (() => {
  const BASE = 'json/';
  let config = null;
  let sample = null;

  async function loadConfig() {
    if (config) return config;
    const res = await fetch(BASE + 'config.json');
    config = await res.json();
    return config;
  }

  async function loadSample() {
    if (sample) return sample;
    const res = await fetch(BASE + 'sample-data.json');
    sample = await res.json();
    return sample;
  }

  /* ── Helper: fetch JSON with timeout ── */
  async function fetchJSON(url, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  /* ── Quote ── */
  async function getQuote() {
    const cfg = await loadConfig();
    try {
      const data = await fetchJSON(cfg.apis.quotes.url);
      // Quotable returns { content, author }
      if (data && data.content) {
        return { content: simplify(data.content), author: data.author || 'Unknown' };
      }
      throw new Error('Bad quote shape');
    } catch (e) {
      console.warn('Quote API failed, using sample.', e);
      const s = await loadSample();
      return { content: s.quote.content, author: s.quote.author };
    }
  }

  /* ── Joke ── */
  async function getJoke() {
    const cfg = await loadConfig();
    try {
      const data = await fetchJSON(cfg.apis.jokes.url);
      if (data.error) throw new Error(data.message || 'JokeAPI error');

      if (data.type === 'single') {
        return { text: simplify(data.joke), setup: null, delivery: null };
      }
      // twopart
      return {
        setup: simplify(data.setup),
        delivery: simplify(data.delivery),
        text: simplify(data.setup + ' ' + data.delivery)
      };
    } catch (e) {
      console.warn('Joke API failed, using sample.', e);
      const s = await loadSample();
      return {
        setup: s.joke.setup,
        delivery: s.joke.delivery,
        text: s.joke.setup + ' ' + s.joke.delivery
      };
    }
  }

  /* ── Health Tip ── */
  async function getHealthTip() {
    const cfg = await loadConfig();
    try {
      const data = await fetchJSON(cfg.apis.health.url);
      // MyHealthfinder returns { Result: { Resources: { Resource: [...] } } }
      const resource = data?.Result?.Resources?.Resource?.[0];
      if (resource) {
        return {
          title: simplify(resource.Title || 'Health Tip'),
          text: simplify(resource.Sections?.Section?.[0]?.Content || resource.Title || '')
        };
      }
      throw new Error('Bad health shape');
    } catch (e) {
      console.warn('Health API failed, using sample.', e);
      const s = await loadSample();
      return { title: s.health.title, text: s.health.text };
    }
  }

  /* ── Advice ── */
  async function getAdvice() {
    const cfg = await loadConfig();
    try {
      const data = await fetchJSON(cfg.apis.advice.url);
      if (data?.slip?.advice) {
        return { text: simplify(data.slip.advice) };
      }
      throw new Error('Bad advice shape');
    } catch (e) {
      console.warn('Advice API failed, using sample.', e);
      const s = await loadSample();
      return { text: s.advice.text };
    }
  }

  /* ── Stories (NewsData.io — needs API key) ── */
  async function getStories() {
    const cfg = await loadConfig();
    const key = cfg.apis.stories.url;
    if (!key || key.includes('YOUR_API_KEY')) {
      // No API key — use sample story
      const s = await loadSample();
      return [{ id: 'sample', title: s.story.title, body: s.story.body }];
    }
    try {
      const data = await fetchJSON(cfg.apis.stories.url);
      if (!data.results || !data.results.length) throw new Error('No results');
      return data.results.map((r, i) => ({
        id: r.article_id || 'news-' + i,
        title: simplify(r.title || 'Story'),
        body: simplify(r.description || r.content || 'Read more at the source.')
      }));
    } catch (e) {
      console.warn('Stories API failed, using sample.', e);
      const s = await loadSample();
      return [{ id: 'sample', title: s.story.title, body: s.story.body }];
    }
  }

  /* ── Fifth-grader English simplifier (rule-based, client-side) ── */
  function simplify(text) {
    if (!text) return '';
    return String(text)
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Replace hard words with simple ones
      .replace(/\butilize\b/gi, 'use')
      .replace(/\bcommence\b/gi, 'start')
      .replace(/\bterminate\b/gi, 'end')
      .replace(/\bapproximately\b/gi, 'about')
      .replace(/\bsufficient\b/gi, 'enough')
      .replace(/\bnumerous\b/gi, 'many')
      .replace(/\bprior to\b/gi, 'before')
      .replace(/\bsubsequently\b/gi, 'later')
      .replace(/\badditionally\b/gi, 'also')
      .replace(/\bconsequently\b/gi, 'so')
      .replace(/\bnevertheless\b/gi, 'still')
      // Shorten very long sentences (split at 18 words)
      .split(/(?<=[.!?])\s+/)
      .map(sentence => {
        const words = sentence.split(' ');
        if (words.length <= 18) return sentence;
        const mid = Math.ceil(words.length / 2);
        return words.slice(0, mid).join(' ') + '. ' + words.slice(mid).join(' ');
      })
      .join(' ')
      // Ensure proper sentence casing
      .replace(/(^\w|\.\s+\w)/g, m => m.toUpperCase())
      .trim();
  }

  return { getQuote, getJoke, getHealthTip, getAdvice, getStories, simplify };
})();

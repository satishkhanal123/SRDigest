/* ═══════════════════════════════════════
   ACCESSIBILITY — font size, contrast, TTS
   ═══════════════════════════════════════ */

const Accessibility = (() => {
  const FONT_SIZES = ['sm', 'md', 'lg', 'xl'];
  let fontIndex = 1; // 'md'

  function init() {
    // Restore saved preferences
    const savedFont = localStorage.getItem('gr_fontsize');
    if (savedFont && FONT_SIZES.includes(savedFont)) {
      fontIndex = FONT_SIZES.indexOf(savedFont);
      document.documentElement.dataset.fontsize = savedFont;
    }

    const savedTheme = localStorage.getItem('gr_theme');
    if (savedTheme === 'contrast') {
      document.documentElement.dataset.theme = 'contrast';
    }

    // Wire buttons
    document.getElementById('fontToggle')?.addEventListener('click', cycleFont);
    document.getElementById('contrastToggle')?.addEventListener('click', toggleContrast);
    document.getElementById('ttsToggle')?.addEventListener('click', togglePageTTS);

    // Wire per-card TTS buttons
    document.querySelectorAll('.tts-controls').forEach(ctrl => {
      const targetId = ctrl.dataset.target;
      const playBtn = ctrl.querySelector('.btn-tts:not(.btn-tts-stop)');
      const stopBtn = ctrl.querySelector('.btn-tts-stop');

      playBtn?.addEventListener('click', () => speakCard(targetId, playBtn, stopBtn));
      stopBtn?.addEventListener('click', () => {
        TTS.stop();
        playBtn.hidden = false;
        stopBtn.hidden = true;
      });
    });

    // Stop speech when leaving page
    window.addEventListener('beforeunload', () => TTS.stop());
  }

  function cycleFont() {
    fontIndex = (fontIndex + 1) % FONT_SIZES.length;
    const size = FONT_SIZES[fontIndex];
    document.documentElement.dataset.fontsize = size;
    localStorage.setItem('gr_fontsize', size);
  }

  function toggleContrast() {
    const isContrast = document.documentElement.dataset.theme === 'contrast';
    if (isContrast) {
      document.documentElement.dataset.theme = 'light';
      localStorage.setItem('gr_theme', 'light');
    } else {
      document.documentElement.dataset.theme = 'contrast';
      localStorage.setItem('gr_theme', 'contrast');
    }
  }

  let pageTTSActive = false;
  function togglePageTTS() {
    if (pageTTSActive) {
      TTS.stop();
      pageTTSActive = false;
      return;
    }
    const main = document.getElementById('main-content');
    if (!main) return;
    const text = main.innerText.replace(/\s+/g, ' ').trim();
    if (!text) return;
    pageTTSActive = true;
    TTS.speak(text, { rate: 0.85 });
    TTS.onStateChange = (speaking) => { if (!speaking) pageTTSActive = false; };
  }

  function speakCard(targetId, playBtn, stopBtn) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const text = el.innerText.replace(/\s+/g, ' ').trim();
    if (!text) return;

    TTS.speak(text, { rate: 0.85 });
    playBtn.hidden = true;
    stopBtn.hidden = false;

    TTS.onStateChange = (speaking) => {
      if (!speaking) {
        playBtn.hidden = false;
        stopBtn.hidden = true;
      }
    };
  }

  return { init };
})();

/* ═══════════════════════════════════════
   TTS — Web Speech API text-to-speech
   Senior-friendly voice selection
   ═══════════════════════════════════════ */

const TTS = (() => {
  const synth = window.speechSynthesis;

  let currentUtterance = null;
  let isSpeaking = false;
  let onStateChange = null;
  let voices = [];

  const DEFAULT_RATE = 0.95;
  const DEFAULT_PITCH = 1.0;
  const DEFAULT_VOLUME = 1.0;
  const DEFAULT_LANG = 'en-US';

  function isSupported() {
    return 'speechSynthesis' in window;
  }

  /* ── Load available voices ── */
  function loadVoices() {
    if (!isSupported()) return;

    voices = synth.getVoices();

    if (!voices.length) return;

    console.log(
      'Golden Reader voices:',
      voices.map(v => `${v.name} (${v.lang})`)
    );
  }

  /* ── Choose the best available English voice ── */
  function getVoice() {
    if (!voices.length) {
      loadVoices();
    }

    if (!voices.length) return null;

    /*
      Preference order:
      1. Previously selected voice
      2. English US local voice
      3. English GB local voice
      4. Any English local voice
      5. Any English voice
    */

    const savedVoice = localStorage.getItem('gr_voice');

    if (savedVoice) {
      const saved = voices.find(v => v.name === savedVoice);
      if (saved) return saved;
    }

    return (
      voices.find(v =>
        v.lang === 'en-US' && v.localService
      ) ||

      voices.find(v =>
        v.lang === 'en-GB' && v.localService
      ) ||

      voices.find(v =>
        v.lang.startsWith('en') && v.localService
      ) ||

      voices.find(v =>
        v.lang.startsWith('en')
      ) ||

      voices[0]
    );
  }

  /* ── Speak ── */
  function speak(text, options = {}) {
    if (!isSupported()) {
      alert('Sorry, your browser does not support voice reading.');
      return;
    }

    if (!text || !text.trim()) return;

    stop();

    const utterance = new SpeechSynthesisUtterance(text);

    const voice = getVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = options.lang || DEFAULT_LANG;
    }

    utterance.rate =
      options.rate ?? DEFAULT_RATE;

    utterance.pitch =
      options.pitch ?? DEFAULT_PITCH;

    utterance.volume =
      options.volume ?? DEFAULT_VOLUME;

    utterance.onstart = () => {
      isSpeaking = true;

      if (onStateChange) {
        onStateChange(true);
      }
    };

    utterance.onend = () => {
      isSpeaking = false;
      currentUtterance = null;

      if (onStateChange) {
        onStateChange(false);
      }
    };

    utterance.onerror = (event) => {
      console.warn('TTS error:', event);

      isSpeaking = false;
      currentUtterance = null;

      if (onStateChange) {
        onStateChange(false);
      }
    };

    currentUtterance = utterance;

    synth.speak(utterance);
  }

  /* ── Stop ── */
  function stop() {
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    isSpeaking = false;
    currentUtterance = null;
  }

  /* ── Save voice preference ── */
  function setVoice(voiceName) {
    const voice = voices.find(v => v.name === voiceName);

    if (!voice) return false;

    localStorage.setItem('gr_voice', voice.name);

    return true;
  }

  /* ── Get available voices ── */
  function getVoices() {
    loadVoices();

    return [...voices];
  }

  /* ── Browser loads voices asynchronously ── */
  if (isSupported()) {
    loadVoices();

    synth.onvoiceschanged = () => {
      loadVoices();
    };
  }

  return {
    isSupported,
    speak,
    stop,
    getVoice,
    getVoices,
    setVoice,

    get isSpeaking() {
      return isSpeaking;
    },

    set onStateChange(fn) {
      onStateChange = fn;
    }
  };
})();

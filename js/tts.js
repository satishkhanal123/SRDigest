/* ═══════════════════════════════════════
   TTS — Web Speech API text-to-speech
   ═══════════════════════════════════════ */

const TTS = (() => {
  const synth = window.speechSynthesis;
  let currentUtterance = null;
  let isSpeaking = false;
  let onStateChange = null;

  function isSupported() {
    return 'speechSynthesis' in window;
  }

  function speak(text, options = {}) {
    if (!isSupported()) {
      alert('Sorry, your browser does not support voice reading.');
      return;
    }
    stop(); // cancel any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.85;   // slower for seniors
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = options.lang || 'en-US';

    utterance.onstart = () => {
      isSpeaking = true;
      onStateChange && onStateChange(true);
    };
    utterance.onend = () => {
      isSpeaking = false;
      currentUtterance = null;
      onStateChange && onStateChange(false);
    };
    utterance.onerror = () => {
      isSpeaking = false;
      currentUtterance = null;
      onStateChange && onStateChange(false);
    };

    currentUtterance = utterance;
    synth.speak(utterance);
  }

  function stop() {
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }
    isSpeaking = false;
    currentUtterance = null;
  }

  function getVoice() {
    const voices = synth.getVoices();
    return voices.find(v => v.lang.startsWith('en') && v.localService) ||
           voices.find(v => v.lang.startsWith('en')) ||
           voices[0] || null;
  }

  /* Pre-load voices */
  if (isSupported()) {
    synth.onvoiceschanged = () => { /* voices ready */ };
  }

  return {
    isSupported,
    speak,
    stop,
    get isSpeaking() { return isSpeaking; },
    set onStateChange(fn) { onStateChange = fn; }
  };
})();

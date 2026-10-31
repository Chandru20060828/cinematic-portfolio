// Optional voice narration using the browser's built‑in speech synthesis (free, no API).
const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

function pickVoice(lang) {
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;
  const base = lang.split('-')[0];
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(base) && /natural|google|online/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith(base)) ||
    null
  );
}

export const speech = {
  supported: !!synth,
  speak(text, { pitch = 1, rate = 0.95, lang = 'en-IN' } = {}) {
    if (!synth || !text) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.pitch = pitch;
    u.rate = rate;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    synth.speak(u);
  },
  cancel() {
    synth?.cancel();
  },
  pause() {
    synth?.pause();
  },
  resume() {
    synth?.resume();
  },
};

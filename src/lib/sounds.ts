/**
 * Provenly sound effects — minimal, professional, warm.
 * Inspired by Apple, Linear, and Vercel interactions.
 * All sounds are synthesized at runtime — no external audio files.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

export function resumeAudio() {
  try {
    getCtx().resume();
  } catch {
    /* silent */
  }
}

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

function softTone(freq: number, duration: number, vol: number, type: OscillatorType = "sine") {
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  } catch {
    /* silent */
  }
}

function warmClick() {
  softTone(520, 0.06, 0.04, "sine");
  setTimeout(() => softTone(440, 0.04, 0.02, "sine"), 8);
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Primary CTA button — warm, barely-there tap */
export function playClick() {
  warmClick();
}

/** Secondary / ghost button — slightly softer */
export function playClickSoft() {
  softTone(380, 0.05, 0.025, "sine");
}

/** Card hover — micro-tick, nearly subliminal */
export function playHover() {
  softTone(1800, 0.025, 0.015, "sine");
}

/** Tab switch / toggle — two soft micro-tones */
export function playSwitch() {
  softTone(600, 0.04, 0.025, "sine");
  setTimeout(() => softTone(750, 0.035, 0.02, "sine"), 20);
}

/** Navigation link — muted, warm */
export function playNav() {
  softTone(420, 0.045, 0.02, "triangle");
}

/** Success / verification — gentle ascending two-note chime */
export function playSuccess() {
  softTone(660, 0.12, 0.03, "sine");
  setTimeout(() => softTone(880, 0.1, 0.025, "sine"), 80);
}

/** Micro tick for minor UI feedback */
export function playTick() {
  softTone(1200, 0.02, 0.012, "sine");
}

/**
 * Lightweight Web Audio API sound effects for Provenly.
 * All sounds are synthesized at runtime — no external audio files needed.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

/** Resume context on first user gesture (Chrome autoplay policy). */
export function resumeAudio() {
  try {
    getCtx().resume();
  } catch {
    // silent — Web Audio may not be available
  }
}

/* ------------------------------------------------------------------ */
/*  Sound generators                                                   */
/* ------------------------------------------------------------------ */

/**
 * Short, crisp digital click — used for primary CTA buttons.
 * A quick sine blip at ~1200 Hz with fast decay.
 */
export function playClick() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    /* silent */
  }
}

/**
 * Softer secondary click — used for secondary/ghost buttons.
 * Slightly lower pitch and quieter.
 */
export function playClickSoft() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    /* silent */
  }
}

/**
 * Subtle hover tick — very quiet, barely perceptible.
 * Short high-frequency blip.
 */
export function playHover() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2000, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    /* silent */
  }
}

/**
 * Tab switch / toggle sound — two quick micro-tones.
 * Used for testimonial tabs and dropdown toggles.
 */
export function playSwitch() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;

    // First tone
    const osc1 = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1400, now);
    gain1.gain.setValueAtTime(0.06, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1).connect(ac.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // Second tone (delayed)
    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1800, now + 0.04);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.05, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc2.connect(gain2).connect(ac.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.1);
  } catch {
    /* silent */
  }
}

/**
 * Navigation link click — muted, low-pitched tap.
 */
export function playNav() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    /* silent */
  }
}

/**
 * Shield verification / success — gentle ascending two-note chime.
 * Used for the hero shield appearance.
 */
export function playSuccess() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;

    // Note 1
    const osc1 = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(800, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(gain1).connect(ac.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Note 2 (higher, delayed)
    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1200, now + 0.12);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.06, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2).connect(ac.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.36);
  } catch {
    /* silent */
  }
}

/**
 * Micro tick — tiny sharp transient for minor UI feedback.
 */
export function playTick() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(3000, now);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  } catch {
    /* silent */
  }
}

/**
 * Provenly sound effects — polished, premium, tactile.
 * Inspired by Linear, Stripe, and Apple's interaction audio.
 * All sounds are synthesized at runtime — zero external files.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function resumeAudio() {
  try { getCtx().resume(); } catch { /* silent */ }
}

/* ------------------------------------------------------------------ */
/*  Core synth helper                                                  */
/* ------------------------------------------------------------------ */

function synth(
  freq: number,
  vol: number,
  duration: number,
  type: OscillatorType = "sine",
  attackMs = 6,
  delayMs = 0,
) {
  try {
    const ac = getCtx();
    const now = ac.currentTime + delayMs / 1000;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + attackMs / 1000);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch { /* silent */ }
}

/* ------------------------------------------------------------------ */
/*  Public API — each function is one distinct interaction             */
/* ------------------------------------------------------------------ */

/**
 * Primary CTA click — warm, rounded tap with soft attack.
 * Think: Linear's primary button press.
 */
export function playClick() {
  synth(440, 0.045, 0.07, "sine", 4);
  synth(330, 0.025, 0.05, "sine", 6, 3);
}

/**
 * Secondary button — lighter, higher, shorter.
 */
export function playClickSoft() {
  synth(560, 0.025, 0.04, "sine", 3);
}

/**
 * Card hover — barely-there micro blip.
 * Should feel like a whisper, not a sound.
 */
export function playHover() {
  synth(2400, 0.012, 0.018, "sine", 2);
}

/**
 * Tab switch / toggle — two soft micro-tones,
 * like a refined toggle flip.
 */
export function playSwitch() {
  synth(520, 0.025, 0.04, "sine", 3);
  synth(680, 0.018, 0.035, "sine", 3, 22);
}

/**
 * Navigation click — muted, warm, like a soft keyboard tap.
 */
export function playNav() {
  synth(360, 0.02, 0.04, "triangle", 5);
}

/**
 * Success / verification — gentle ascending chime.
 * Feels like a door unlocking quietly.
 */
export function playSuccess() {
  synth(660, 0.03, 0.14, "sine", 8);
  synth(880, 0.022, 0.12, "sine", 8, 90);
  synth(1100, 0.012, 0.08, "sine", 6, 170);
}

/**
 * Micro tick — tiny, sharp, for minor feedback.
 */
export function playTick() {
  synth(1400, 0.015, 0.015, "sine", 2);
}

/**
 * Scroll reveal — soft whoosh-feel, used when a section enters view.
 */
export function playReveal() {
  synth(200, 0.008, 0.15, "sine", 10);
}

/**
 * Counter tick — tiny blip for each number increment.
 */
export function playCounterTick() {
  synth(1800, 0.006, 0.008, "sine", 1);
}

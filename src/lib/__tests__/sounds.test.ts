// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

let lastCtx: Record<string, unknown>;

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  lastCtx = {
    currentTime: 0,
    destination: {},
    createOscillator: vi.fn(() => ({
      type: "" as OscillatorType,
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn().mockReturnThis(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createGain: vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn().mockReturnThis(),
    })),
    resume: vi.fn().mockResolvedValue(undefined),
  };
  Object.defineProperty(globalThis, "AudioContext", {
    value: Object.assign(function () { return lastCtx; }, { prototype: {} }),
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function loadSounds() {
  return await import("@/lib/sounds");
}

describe("sounds.ts", () => {
  describe("resumeAudio", () => {
    it("creates and resumes AudioContext", async () => {
      const { resumeAudio } = await loadSounds();
      resumeAudio();
      expect(lastCtx.resume).toHaveBeenCalled();
    });

    it("does not throw if AudioContext is unavailable", async () => {
      const { resumeAudio } = await loadSounds();
      const original = globalThis.AudioContext;
      Object.defineProperty(globalThis, "AudioContext", { value: undefined, writable: true, configurable: true });
      expect(() => resumeAudio()).not.toThrow();
      Object.defineProperty(globalThis, "AudioContext", { value: original, writable: true, configurable: true });
    });
  });

  describe("playClick", () => {
    it("creates warm sine click at 440 Hz", async () => {
      const { playClick } = await loadSounds();
      playClick();
      expect(lastCtx.createOscillator).toHaveBeenCalled();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.type).toBe("sine");
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(440, expect.any(Number));
      expect(osc.start).toHaveBeenCalled();
      expect(osc.stop).toHaveBeenCalled();
    });
  });

  describe("playClickSoft", () => {
    it("creates lighter tone at 560 Hz", async () => {
      const { playClickSoft } = await loadSounds();
      playClickSoft();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(560, expect.any(Number));
    });
  });

  describe("playHover", () => {
    it("creates micro-blip at 2400 Hz", async () => {
      const { playHover } = await loadSounds();
      playHover();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(2400, expect.any(Number));
    });
  });

  describe("playSwitch", () => {
    it("fires two tones synchronously", async () => {
      const { playSwitch } = await loadSounds();
      playSwitch();
      // Both tones fire synchronously via synth() with delayMs param
      expect(lastCtx.createOscillator).toHaveBeenCalledTimes(2);
      const createOsc = lastCtx.createOscillator as ReturnType<typeof vi.fn>;
      const osc1 = createOsc.mock.results[0].value;
      const osc2 = createOsc.mock.results[1].value;
      expect(osc1.frequency.setValueAtTime).toHaveBeenCalledWith(520, expect.any(Number));
      expect(osc2.frequency.setValueAtTime).toHaveBeenCalledWith(680, expect.any(Number));
    });
  });

  describe("playNav", () => {
    it("uses triangle waveform at 360 Hz", async () => {
      const { playNav } = await loadSounds();
      playNav();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.type).toBe("triangle");
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(360, expect.any(Number));
    });
  });

  describe("playSuccess", () => {
    it("fires three ascending notes synchronously", async () => {
      const { playSuccess } = await loadSounds();
      playSuccess();
      // All three notes fire synchronously via synth() with delayMs
      expect(lastCtx.createOscillator).toHaveBeenCalledTimes(3);
      const createOsc = lastCtx.createOscillator as ReturnType<typeof vi.fn>;
      expect(createOsc.mock.results[0].value.frequency.setValueAtTime).toHaveBeenCalledWith(660, expect.any(Number));
      expect(createOsc.mock.results[1].value.frequency.setValueAtTime).toHaveBeenCalledWith(880, expect.any(Number));
      expect(createOsc.mock.results[2].value.frequency.setValueAtTime).toHaveBeenCalledWith(1100, expect.any(Number));
    });
  });

  describe("playTick", () => {
    it("creates sine tick at 1400 Hz", async () => {
      const { playTick } = await loadSounds();
      playTick();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.type).toBe("sine");
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(1400, expect.any(Number));
    });
  });

  describe("error resilience", () => {
    it("each function handles AudioContext errors silently", async () => {
      const sounds = await loadSounds();
      Object.defineProperty(globalThis, "AudioContext", {
        value: class {
          createOscillator() { throw new Error("not supported"); }
          createGain() { throw new Error("not supported"); }
          resume() { throw new Error("not supported"); }
        },
        writable: true,
        configurable: true,
      });
      expect(() => sounds.playClick()).not.toThrow();
      expect(() => sounds.playClickSoft()).not.toThrow();
      expect(() => sounds.playHover()).not.toThrow();
      expect(() => sounds.playSwitch()).not.toThrow();
      expect(() => sounds.playNav()).not.toThrow();
      expect(() => sounds.playSuccess()).not.toThrow();
      expect(() => sounds.playTick()).not.toThrow();
      expect(() => sounds.resumeAudio()).not.toThrow();
    });
  });
});

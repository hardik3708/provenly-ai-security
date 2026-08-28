// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

let lastCtx: Record<string, unknown>;

beforeEach(() => {
  vi.resetModules();
  lastCtx = {
    currentTime: 0,
    destination: {},
    createOscillator: vi.fn(() => ({
      type: "" as OscillatorType,
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn().mockReturnThis(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createGain: vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn().mockReturnThis(),
    })),
    resume: vi.fn().mockResolvedValue(undefined),
  };
  // Use Object.defineProperty to make AudioContext a constructor that returns lastCtx
  Object.defineProperty(globalThis, "AudioContext", {
    value: Object.assign(
      function () {
        return lastCtx;
      },
      { prototype: {} }
    ),
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
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
    it("creates oscillator and gain, connects to destination", async () => {
      const { playClick } = await loadSounds();
      playClick();
      expect(lastCtx.createOscillator).toHaveBeenCalled();
      expect(lastCtx.createGain).toHaveBeenCalled();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.type).toBe("sine");
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(1200, expect.any(Number));
      expect(osc.start).toHaveBeenCalled();
      expect(osc.stop).toHaveBeenCalled();
    });
  });

  describe("playClickSoft", () => {
    it("creates oscillator with lower pitch than playClick", async () => {
      const { playClickSoft } = await loadSounds();
      playClickSoft();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(900, expect.any(Number));
    });
  });

  describe("playHover", () => {
    it("creates a quiet oscillator at 2000 Hz", async () => {
      const { playHover } = await loadSounds();
      playHover();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(2000, expect.any(Number));
      const gain = (lastCtx.createGain as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.03, expect.any(Number));
    });
  });

  describe("playSwitch", () => {
    it("creates two oscillators (double tone)", async () => {
      const { playSwitch } = await loadSounds();
      playSwitch();
      expect(lastCtx.createOscillator).toHaveBeenCalledTimes(2);
      expect(lastCtx.createGain).toHaveBeenCalledTimes(2);
    });

    it("first tone is 1400 Hz, second is 1800 Hz", async () => {
      const { playSwitch } = await loadSounds();
      playSwitch();
      const createOsc = lastCtx.createOscillator as ReturnType<typeof vi.fn>;
      const osc1 = createOsc.mock.results[0].value;
      const osc2 = createOsc.mock.results[1].value;
      expect(osc1.frequency.setValueAtTime).toHaveBeenCalledWith(1400, expect.any(Number));
      expect(osc2.frequency.setValueAtTime).toHaveBeenCalledWith(1800, expect.any(Number));
    });
  });

  describe("playNav", () => {
    it("uses triangle waveform", async () => {
      const { playNav } = await loadSounds();
      playNav();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.type).toBe("triangle");
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(600, expect.any(Number));
    });
  });

  describe("playSuccess", () => {
    it("creates two oscillators for ascending chime", async () => {
      const { playSuccess } = await loadSounds();
      playSuccess();
      expect(lastCtx.createOscillator).toHaveBeenCalledTimes(2);
      const createOsc = lastCtx.createOscillator as ReturnType<typeof vi.fn>;
      const osc1 = createOsc.mock.results[0].value;
      const osc2 = createOsc.mock.results[1].value;
      expect(osc1.frequency.setValueAtTime).toHaveBeenCalledWith(800, expect.any(Number));
      expect(osc2.frequency.setValueAtTime).toHaveBeenCalledWith(1200, expect.any(Number));
    });
  });

  describe("playTick", () => {
    it("uses square waveform at 3000 Hz", async () => {
      const { playTick } = await loadSounds();
      playTick();
      const osc = (lastCtx.createOscillator as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(osc.type).toBe("square");
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(3000, expect.any(Number));
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

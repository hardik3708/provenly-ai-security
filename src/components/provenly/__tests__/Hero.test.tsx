// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/provenly/Hero";

// Mock all framer-motion components and hooks
vi.mock("framer-motion", () => {
  const React = require("react");
  const el = (tag: string) => {
    const Component = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const safe: Record<string, unknown> = {};
      for (const k of Object.keys(props)) {
        if (["initial", "animate", "exit", "transition", "key", "variants"].includes(k)) continue;
        if (k.startsWith("on")) { safe[k] = props[k]; continue; }
        if (k === "style" && typeof props[k] === "object") { safe[k] = props[k]; continue; }
        if (k === "className") { safe[k] = props[k]; continue; }
        if (k === "href") { safe[k] = props[k]; continue; }
        if (k === "id") { safe[k] = props[k]; continue; }
        if (k === "aria-label") { safe[k] = props[k]; continue; }
      }
      return React.createElement(tag, safe, children);
    };
    Component.displayName = `motion.${tag}`;
    return Component;
  };

  return {
    motion: {
      div: el("div"),
      span: el("span"),
      h1: el("h1"),
      p: el("p"),
      a: el("a"),
      header: el("header"),
      line: ({ ...props }: Record<string, unknown>) => {
        const safe: Record<string, unknown> = {};
        for (const k of Object.keys(props)) {
          if (["initial", "animate", "transition", "key", "variants"].includes(k)) continue;
          safe[k] = props[k];
        }
        return React.createElement("line", safe);
      },
      circle: ({ ...props }: Record<string, unknown>) => {
        const safe: Record<string, unknown> = {};
        for (const k of Object.keys(props)) {
          if (["initial", "animate", "transition", "key", "variants"].includes(k)) continue;
          safe[k] = props[k];
        }
        return React.createElement("circle", safe);
      },
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => React.createElement(React.Fragment, null, children),
    useInView: () => true,
    useMotionValue: () => ({ set: vi.fn() }),
    useSpring: (v: unknown) => v,
    useTransform: () => 0,
  };
});

// Mock sounds
vi.mock("@/lib/sounds", () => ({
  playClick: vi.fn(),
  playClickSoft: vi.fn(),
  playSuccess: vi.fn(),
  resumeAudio: vi.fn(),
}));

// Mock animations module — render children directly
vi.mock("@/components/provenly/animations", () => {
  const React = require("react");
  return {
    ScrollReveal: ({ children, className }: { children: React.ReactNode; className?: string }) =>
      React.createElement("div", { className }, children),
    TextReveal: ({ children, className }: { children: React.ReactNode; className?: string }) =>
      React.createElement("div", { className }, children),
  };
});

describe("Hero", () => {
  it("renders the eyebrow label", () => {
    render(<Hero />);
    expect(screen.getByText("AI-Powered Cybersecurity")).toBeInTheDocument();
  });

  it("renders the main headline with mint-highlighted word", () => {
    render(<Hero />);
    expect(screen.getByText("AI-powered protection")).toBeInTheDocument();
    expect(screen.getByText("organizations")).toBeInTheDocument();
  });

  it("renders supporting copy", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Provenly detects threats, secures critical systems/)
    ).toBeInTheDocument();
  });

  it("renders both CTA buttons", () => {
    render(<Hero />);
    expect(screen.getByText("Get started")).toBeInTheDocument();
    expect(screen.getByText("Learn more")).toBeInTheDocument();
  });

  it("renders all six tech nodes", () => {
    render(<Hero />);
    expect(screen.getAllByText("AI").length).toBe(2);
    expect(screen.getByText("Cloud")).toBeInTheDocument();
    expect(screen.getByText("Zero Trust")).toBeInTheDocument();
    expect(screen.getAllByText("ML").length).toBe(2);
    expect(screen.getByText("SOC")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
  });

  it("renders the shield check icon", () => {
    const { container } = render(<Hero />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("has correct section id", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section#home");
    expect(section).toBeInTheDocument();
  });
});

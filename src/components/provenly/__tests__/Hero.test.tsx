// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/provenly/Hero";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterDomProps(props)}>{children}</div>
    ),
    h1: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <h1 {...filterDomProps(props)}>{children}</h1>
    ),
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <p {...filterDomProps(props)}>{children}</p>
    ),
    line: ({ ...props }: Record<string, unknown>) => <line {...filterSvgProps(props)} />,
  },
  useInView: () => true,
}));

// Mock sounds
vi.mock("@/lib/sounds", () => ({
  playClick: vi.fn(),
  playClickSoft: vi.fn(),
  playSuccess: vi.fn(),
  resumeAudio: vi.fn(),
}));

function filterDomProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (["children", "initial", "animate", "exit", "transition", "key"].includes(key)) continue;
    domProps[key] = props[key];
  }
  return domProps;
}

function filterSvgProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (["initial", "animate", "transition", "key"].includes(key)) continue;
    domProps[key] = props[key];
  }
  return domProps;
}

describe("Hero", () => {
  it("renders the eyebrow label", () => {
    render(<Hero />);
    expect(screen.getByText("AI-Powered Cybersecurity")).toBeInTheDocument();
  });

  it("renders the main headline with mint-highlighted word", () => {
    render(<Hero />);
    expect(screen.getByText("AI-powered protection for modern")).toBeInTheDocument();
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
    // AI appears twice (icon abbreviation + label)
    expect(screen.getAllByText("AI").length).toBe(2);
    expect(screen.getByText("Cloud")).toBeInTheDocument();
    expect(screen.getByText("Zero Trust")).toBeInTheDocument();
    expect(screen.getAllByText("ML").length).toBe(2);
    expect(screen.getByText("SOC")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
  });

  it("renders the shield check icon", () => {
    const { container } = render(<Hero />);
    // ShieldCheck from lucide renders as an SVG
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("has correct section id", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section#home");
    expect(section).toBeInTheDocument();
  });
});

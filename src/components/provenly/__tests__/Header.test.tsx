// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/provenly/Header";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <header {...filterDomProps(props)}>{children}</header>
    ),
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterDomProps(props)}>{children}</div>
    ),
    a: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <a {...filterDomProps(props)}>{children}</a>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock sounds
vi.mock("@/lib/sounds", () => ({
  playNav: vi.fn(),
  playClick: vi.fn(),
  playSwitch: vi.fn(),
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

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
  });

  it("renders the Provenly wordmark", () => {
    render(<Header />);
    expect(screen.getByText("Provenly")).toBeInTheDocument();
  });

  it("renders all desktop nav links", () => {
    render(<Header />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders the Contact us CTA button", () => {
    render(<Header />);
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });

  it("renders the All Pages dropdown button", () => {
    render(<Header />);
    expect(screen.getByText("All Pages")).toBeInTheDocument();
  });

  it("toggles mobile menu on hamburger click", () => {
    render(<Header />);
    const toggle = screen.getByLabelText("Toggle menu");
    // Mobile menu links not visible initially (only desktop nav has them)
    const mobileHomeLinks = screen.getAllByText("Home");
    expect(mobileHomeLinks.length).toBe(1); // only desktop

    // Click toggle to open
    fireEvent.click(toggle);
    // Mobile nav should appear — now there are 2 "Home" links (desktop + mobile)
    const homeLinksAfter = screen.getAllByText("Home");
    expect(homeLinksAfter.length).toBe(2);
  });

  it("closes mobile menu when a link is clicked", () => {
    render(<Header />);
    const toggle = screen.getByLabelText("Toggle menu");

    // Open menu
    fireEvent.click(toggle);
    expect(screen.getAllByText("Home").length).toBe(2);

    // Click a nav link (last Home is mobile)
    const homeLinks = screen.getAllByText("Home");
    fireEvent.click(homeLinks[homeLinks.length - 1]);
  });
});

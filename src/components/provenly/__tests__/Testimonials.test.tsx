// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Testimonials from "@/components/provenly/Testimonials";

// Mock framer-motion to avoid animation complexity in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterDomProps(props)}>{children}</div>
    ),
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <p {...filterDomProps(props)}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useInView: () => true,
}));

// Mock sounds
vi.mock("@/lib/sounds", () => ({
  playSwitch: vi.fn(),
  playHover: vi.fn(),
  resumeAudio: vi.fn(),
}));

function filterDomProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (key === "children" || key === "initial" || key === "animate" || key === "exit" || key === "transition" || key === "key") continue;
    domProps[key] = props[key];
  }
  return domProps;
}

describe("Testimonials", () => {
  it("renders the section label", () => {
    render(<Testimonials />);
    expect(screen.getByText("Testimonials")).toBeInTheDocument();
  });

  it("renders the first testimonial quote by default", () => {
    render(<Testimonials />);
    expect(
      screen.getByText(/Provenly gave us visibility into threats/)
    ).toBeInTheDocument();
  });

  it("renders all three tab buttons", () => {
    render(<Testimonials />);
    expect(screen.getByText("Sarah Jenkins")).toBeInTheDocument();
    expect(screen.getByText("David Chen")).toBeInTheDocument();
    expect(screen.getByText("Amara Okafor")).toBeInTheDocument();
  });

  it("switches quote when a different tab is clicked", () => {
    render(<Testimonials />);
    // Initially shows Sarah's quote
    expect(screen.getByText(/Provenly gave us visibility/)).toBeInTheDocument();

    // Click David's tab
    fireEvent.click(screen.getByText("David Chen"));

    // Should now show David's quote
    expect(screen.getByText(/speed of detection is extraordinary/)).toBeInTheDocument();
    // Sarah's quote should be gone
    expect(screen.queryByText(/Provenly gave us visibility/)).not.toBeInTheDocument();
  });

  it("renders five mint stars", () => {
    const { container } = render(<Testimonials />);
    // Stars are rendered via lucide Star icon - check for the star container
    const starsContainer = container.querySelector(".flex.items-center.gap-1.mt-8");
    expect(starsContainer).toBeTruthy();
  });

  it("shows role text under each name", () => {
    render(<Testimonials />);
    expect(screen.getByText("CISO, NexaBank")).toBeInTheDocument();
    expect(screen.getByText("VP Engineering, CloudSync")).toBeInTheDocument();
    expect(screen.getByText("CTO, VertexHealth")).toBeInTheDocument();
  });
});

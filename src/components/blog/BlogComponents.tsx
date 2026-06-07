// components/blog/BlogComponents.tsx
// ──────────────────────────────────────────────────────────
//  All schema component renderers — fully responsive.
// ──────────────────────────────────────────────────────────
import React from "react";
import type {
  ImageComponent,
  StatStripComponent,
  GridComponent,
  CalloutComponent,
  PullQuoteComponent,
} from "@/types/blog";

// ── IMAGE ──────────────────────────────────────────────────
export function ImageBlock({
  component,
  figNum,
}: {
  component: ImageComponent;
  figNum: number;
}) {
  const aspectClass =
    component.ASPECT === "hero"
      ? "aspect-video"
      : component.ASPECT === "square"
      ? "aspect-square"
      : "aspect-[3/2]";

  return (
    <div className="my-8 sm:my-10">
      {component.SRC ? (
        <img
          src={component.SRC}
          alt={component.TITLE}
          className={`w-full block border border-[#b8dede] ${aspectClass} object-cover`}
        />
      ) : (
        <div
          className={`w-full ${aspectClass} bg-[#d4f0f0] border border-[#b8dede] flex items-center justify-center`}
        >
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6a8a9a] text-center px-4">
            {component.DESCRIPTION}
          </span>
        </div>
      )}
      <p className="font-mono text-[10px] sm:text-[11px] text-[#6a8a9a] tracking-[0.07em] pt-[9px] border-t border-[#b8dede] mt-[6px]">
        Fig. {figNum} — {component.TITLE}
      </p>
    </div>
  );
}

// ── STAT STRIP ─────────────────────────────────────────────
export function StatStrip({ component }: { component: StatStripComponent }) {
  const count = component.STATS.length;

  return (
    <div
      className="my-8 sm:my-10 grid gap-px border border-[#b8dede]"
      style={{
        // Responsive: 1 col on mobile, up to count cols on sm+
        gridTemplateColumns: `repeat(${Math.min(count, 1)}, 1fr)`,
        background: "#b8dede",
      }}
    >
      {/* We override the inline gridTemplateColumns via a responsive wrapper approach */}
      {component.STATS.map((stat, i) => (
        <div
          key={i}
          className="bg-[#f2fafa] px-5 py-6 sm:py-5 text-center"
        >
          <span className="font-serif font-black text-[28px] sm:text-[34px] text-[#1a2e3b] block leading-none mb-[6px]">
            {stat.NUM}
          </span>
          <span className="font-mono text-[10px] tracking-[0.13em] uppercase text-[#6a8a9a]">
            {stat.LABEL}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── STAT STRIP (responsive via CSS grid auto-fit) ──────────
// Note: We override StatStrip to use CSS auto-fit properly
export function StatStripResponsive({ component }: { component: StatStripComponent }) {
  return (
    <div
      className="my-8 sm:my-10 border border-[#b8dede] grid gap-px"
      style={{
        background: "#b8dede",
        gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))`,
      }}
    >
      {component.STATS.map((stat, i) => (
        <div key={i} className="bg-[#f2fafa] px-4 py-6 text-center">
          <span className="font-serif font-black text-[28px] sm:text-[34px] text-[#1a2e3b] block leading-none mb-[6px]">
            {stat.NUM}
          </span>
          <span className="font-mono text-[10px] tracking-[0.13em] uppercase text-[#6a8a9a] block max-w-[120px] mx-auto">
            {stat.LABEL}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── GRID ───────────────────────────────────────────────────
export function GridBlock({ component }: { component: GridComponent }) {
  const count = component.ITEMS.length;
  // 1 col on mobile, 2 cols on sm+, but if only 1 item always full width
  const cols = count === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";

  return (
    <div
      className={`my-8 sm:my-10 grid ${cols} gap-px border border-[#b8dede]`}
      style={{ background: "#b8dede" }}
    >
      {component.ITEMS.map((item, i) => (
        <div key={i} className="bg-[#f2fafa] p-5 sm:p-6 relative overflow-hidden">
          {/* Ghost number */}
          <span className="font-serif font-black text-[48px] sm:text-[52px] text-[#d4f0f0] absolute top-1 right-3 leading-none select-none pointer-events-none">
            {item.NUM}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5bbfbf] mb-[6px] block">
            {item.LABEL}
          </span>
          <div className="font-serif text-[15px] sm:text-[16px] font-bold text-[#1a2e3b] mb-[6px] pr-6">
            {item.TITLE}
          </div>
          <p className="text-[13px] sm:text-[14px] leading-[1.6] text-[#2e4a5a] m-0">
            {item.BODY}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── CALLOUT ────────────────────────────────────────────────
export function Callout({ component }: { component: CalloutComponent }) {
  const isRed = component.STYLE === "red";
  return (
    <div
      className={`my-7 sm:my-8 px-5 sm:px-6 py-5 bg-[#e6f5f5] text-[15px] sm:text-[16px] leading-[1.7]`}
      style={{
        borderLeft: `4px solid ${isRed ? "#1a2e3b" : "#d4891a"}`,
      }}
    >
      <p className="m-0 text-[#1a2e3b]">{component.TEXT}</p>
    </div>
  );
}

// ── PULL QUOTE ─────────────────────────────────────────────
export function PullQuote({ component }: { component: PullQuoteComponent }) {
  return (
    <div className="my-8 sm:my-10 bg-[#1a2e3b] px-6 sm:px-8 py-6 sm:py-7 pl-10 sm:pl-14 relative">
      {/* Opening quote mark */}
      <span
        className="font-serif text-[80px] sm:text-[96px] text-[#5bbfbf] absolute top-[-10px] sm:top-[-12px] left-2 sm:left-3 leading-none opacity-70 select-none pointer-events-none"
        aria-hidden
      >
        &ldquo;
      </span>
      <p
        className="font-serif italic leading-[1.6] text-[#d4f0f0] m-0"
        style={{ fontSize: "clamp(16px, 2.2vw, 19px)" }}
      >
        {component.TEXT}
      </p>
    </div>
  );
}

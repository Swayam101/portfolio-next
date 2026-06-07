"use client";
// components/blog/BlogSidebar.tsx
// ─────────────────────────────────────────────────────
//  Two exports:
//    <BlogSidebar toc={…} mobileOnly />   → renders only the sticky mobile TOC bar
//    <BlogSidebar toc={…} desktopOnly />  → renders only the sticky desktop aside
// ─────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import type { SidebarTOCItem } from "@/types/blog";

interface Props {
  toc: SidebarTOCItem[];
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

function useActiveSection(toc: SidebarTOCItem[]) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = toc.map((_, i) => document.getElementById(`s${i + 1}`));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.id.replace("s", "")) - 1;
            setActive(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  return active;
}

// ── DESKTOP: sticky side column ──────────────────────────────────
function DesktopSidebar({ toc }: { toc: SidebarTOCItem[] }) {
  const active = useActiveSection(toc);
  return (
    <aside
      className="hidden lg:block w-[210px] shrink-0 pl-8 py-10 sticky top-8 self-start"
      style={{ borderLeft: "1px solid #b8dede" }}
    >
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#5bbfbf] block mb-3">
        Contents
      </span>
      <ul className="list-none p-0 m-0 space-y-0">
        {toc.map((item, i) => (
          <li key={i} className="border-b border-[#ddf0f0] last:border-b-0">
            <a
              href={`#s${i + 1}`}
              className={`flex items-baseline gap-2 py-[9px] no-underline transition-colors duration-200 group ${
                active === i ? "text-[#1a2e3b]" : "text-[#5a7a8a] hover:text-[#1a2e3b]"
              }`}
            >
              <span
                className={`font-mono text-[10px] shrink-0 w-4 transition-colors duration-200 ${
                  active === i ? "text-[#5bbfbf]" : "text-[#a0c0c8]"
                }`}
              >
                {item.NUM}
              </span>
              <span
                className={`text-[12.5px] leading-snug ${active === i ? "font-semibold" : "font-normal"}`}
              >
                {item.TITLE}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ── MOBILE / TABLET: sticky top bar + dropdown drawer ────────────
function MobileTOC({ toc }: { toc: SidebarTOCItem[] }) {
  const active = useActiveSection(toc);
  const [open, setOpen] = useState(false);

  // Close drawer on scroll (after a jump)
  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <div className="lg:hidden sticky top-0 z-30">
      {/* Pill trigger bar */}
      <div
        className="flex items-center justify-between gap-3 px-5 sm:px-8 py-[11px]"
        style={{
          background: "rgba(212,240,240,0.96)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #b8dede",
        }}
      >
        {/* Active section label */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#5bbfbf] shrink-0">
            §
          </span>
          <span
            className="text-[13px] font-semibold text-[#1a2e3b] truncate"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            {toc[active]?.TITLE ?? "Contents"}
          </span>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close table of contents" : "Open table of contents"}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] uppercase shrink-0 transition-colors duration-150 text-[#5bbfbf] hover:text-[#1a2e3b]"
        >
          {open ? "Close" : "Contents"}
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M2 4.5l4.5 4.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown nav */}
      {open && (
        <nav
          className="absolute inset-x-0 top-full z-20 shadow-xl"
          style={{
            background: "#f2fafa",
            borderBottom: "2px solid #b8dede",
          }}
        >
          <ul className="list-none p-0 m-0 max-w-[680px] mx-auto divide-y divide-[#e0f0f0]">
            {toc.map((item, i) => (
              <li key={i}>
                <a
                  href={`#s${i + 1}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-5 px-5 sm:px-8 py-3.5 no-underline transition-colors duration-150 ${
                    active === i ? "bg-[#edf8f8]" : "hover:bg-[#edf8f8]"
                  }`}
                >
                  <span
                    className="font-mono text-[11px] tracking-[0.15em] w-5 shrink-0"
                    style={{ color: active === i ? "#5bbfbf" : "#a0c0c8" }}
                  >
                    {item.NUM}
                  </span>
                  <span
                    className={`text-[15px] leading-snug flex-1 ${
                      active === i ? "font-semibold text-[#1a2e3b]" : "font-normal text-[#4a6a7a]"
                    }`}
                    style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                  >
                    {item.TITLE}
                  </span>
                  {active === i && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5bbfbf] shrink-0" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

// ── Single export — caller controls which variant renders ─────────
export function BlogSidebar({ toc, mobileOnly, desktopOnly }: Props) {
  if (mobileOnly) return <MobileTOC toc={toc} />;
  if (desktopOnly) return <DesktopSidebar toc={toc} />;
  // fallback: render both (let CSS handle visibility)
  return (
    <>
      <MobileTOC toc={toc} />
      <DesktopSidebar toc={toc} />
    </>
  );
}

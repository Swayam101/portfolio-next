"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useHydrationSafeMediaQuery } from "../../hooks/useHydrationSafeMediaQuery";
import { gsap } from "gsap";
import { scrollToSection } from "../../utils/scrollToSection";
import { SOCIAL_LINKS } from "../../constants/socialLinks";

const NAV_LINKS = [
  { label: "Home", targetId: "" },
  { label: "About", targetId: "about" },
  { label: "Contact", targetId: "contact" },
  { label: "Crafts", targetId: "projects" },
];

export default function FloatingNav() {
  const [open, setOpen] = useState(false);
  const [showOnDesktop, setShowOnDesktop] = useState(false);
  const isMobile = useHydrationSafeMediaQuery({ maxWidth: 767 });
  const backdropRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const header = document.getElementById("main-header");
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowOnDesktop(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const visible = isMobile || showOnDesktop;

  useEffect(() => {
    const backdrop = backdropRef.current;
    const sidebar = sidebarRef.current;
    if (!backdrop || !sidebar) return;

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.to(sidebar, { x: 0, duration: 0.5, ease: "power3.out", overwrite: true });
      // Focus first nav link when sidebar opens (focus trap)
      const firstLink = sidebar.querySelector<HTMLAnchorElement>("a.sidebar-nav-link");
      requestAnimationFrame(() => firstLink?.focus());
    } else {
      gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(sidebar, {
        x: "100%",
        duration: 0.45,
        ease: "power3.in",
        overwrite: true,
        onComplete: () => {
          document.body.style.overflow = "";
          menuBtnRef.current?.focus();
        },
      });
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (sidebar) gsap.set(sidebar, { x: "100%" });
  }, []);

  return (
    <>
      <style>{`
        .floating-nav-bar { transition: transform 0.3s ease; }
        .floating-nav-btn:hover .floating-nav-bar { transform: rotate(5deg) scale(1.05); }
        .sidebar-nav-link {
          position: relative;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .sidebar-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 2px;
          background: var(--pacific-blue);
          transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .sidebar-nav-link:hover {
          color: var(--pacific-blue);
          transform: translateX(8px);
        }
        .sidebar-nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      {/* Fixed hamburger — top right, bigger */}
      <div
        className="fixed top-6 right-6 z-[100] transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-[var(--pale-sky)] shadow-xl border-2 border-[rgba(var(--pacific-blue-rgb),0.4)] hover:border-[var(--pacific-blue)] transition-colors duration-300"
          style={{ transform: "scale(1.15)" }}
        >
          <button
            ref={menuBtnRef}
            onClick={() => setOpen(!open)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
            className="bg-transparent border-none cursor-pointer outline-none w-full h-full flex items-center justify-center p-3 floating-nav-btn"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 64 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="floating-nav-bar"
            >
              <path
                d={open ? "M10,10 Q32,32 54,42" : "M6,9 Q24,7 58,11"}
                stroke="var(--yale-blue)"
                strokeWidth="6.5"
                strokeLinecap="round"
                style={{ transition: "d 0.45s cubic-bezier(0.34,1.3,0.64,1)" }}
              />
              <path
                d={open ? "M54,10 Q32,32 10,42" : "M12,26 Q28,24 50,27"}
                stroke="var(--yale-blue)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ transition: "d 0.45s cubic-bezier(0.34,1.3,0.64,1)" }}
              />
              <path
                d={open ? "M32,26 Q32,26 32,26" : "M4,42 Q26,39 56,44"}
                stroke="var(--yale-blue)"
                strokeWidth="5.5"
                strokeLinecap="round"
                style={{
                  transition: "d 0.4s cubic-bezier(0.34,1.3,0.64,1), opacity 0.3s ease",
                  opacity: open ? 0 : 1,
                }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar overlay + panel */}
      <div
        className="fixed inset-0 z-[99] pointer-events-none"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {/* Backdrop */}
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-[var(--yale-blue)]/70 backdrop-blur-md"
          style={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          aria-hidden
        />

        {/* Sidebar panel — GSAP-animated slide */}
        <aside
          ref={sidebarRef}
          role="dialog"
          aria-label="Navigation menu"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="absolute top-0 right-0 h-full w-[min(380px,90vw)] bg-[var(--frozen-water)] shadow-[-8px_0_40px_rgba(27,73,101,0.15)] flex flex-col pt-28 px-10 pb-8"
          style={{
            transform: "translateX(100%)",
            borderLeft: "3px solid rgba(var(--pacific-blue-rgb),0.4)",
          }}
        >
          {/** Nav with index numbers */}
          <nav className="flex-1 sn-pro">
            <ul className="flex flex-col gap-8">
              {NAV_LINKS.map(({ label, targetId }, i) => (
                <li key={label}>
                  <a
                    href={targetId ? `#${targetId}` : "#hero"}
                    className="sidebar-nav-link flex items-baseline gap-4 no-underline group"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(targetId);
                      setOpen(false);
                    }}
                  >
                    <span
                      className="font-['Bebas_Neue'] text-5xl text-[var(--pacific-blue)] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ lineHeight: 0.9 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-2xl font-light text-[var(--yale-blue)] group-hover:text-[var(--pacific-blue)] transition-colors duration-300">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
              {/* Writing — real page link */}
              <li>
                <Link
                  href="/blog"
                  className="sidebar-nav-link flex items-baseline gap-4 no-underline group"
                  onClick={() => setOpen(false)}
                >
                  <span
                    className="font-['Bebas_Neue'] text-5xl text-[var(--pacific-blue)] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ lineHeight: 0.9 }}
                  >
                    {String(NAV_LINKS.length + 1).padStart(2, "0")}
                  </span>
                  <span className="text-2xl font-light text-[var(--yale-blue)] group-hover:text-[var(--pacific-blue)] transition-colors duration-300">
                    Writing
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          {/** Social links footer */}
          <div className="flex flex-col gap-4 pt-8 border-t-2 border-[rgba(var(--pacific-blue-rgb),0.25)]">
            <span className="font-['Bebas_Neue'] text-xs tracking-[0.25em] text-[var(--pacific-blue)] opacity-80">
              CONNECT
            </span>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[rgba(var(--pacific-blue-rgb),0.4)] text-[var(--yale-blue)] hover:bg-[var(--pacific-blue)] hover:text-[var(--pale-sky)] hover:border-[var(--pacific-blue)] transition-all duration-300 hover:scale-110"
                >
                  {icon === "github" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  )}
                  {icon === "linkedin" && (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                  {icon === "x" && (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {icon === "email" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  )}
                  {icon === "telegram" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

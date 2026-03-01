import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import C from "../../constants/colors";


export interface ScrollArrowProps {
  label?: string;
  variant?: "dark" | "light";
  scrollTo?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export default function GoDownBtn({
  label = "SCROLL",
  variant = "dark",
  scrollTo,
  style,
  className = "",
}: ScrollArrowProps) {
  const btnRef  = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);

  const isDark = variant === "dark";
  // Dark variant: yaleBlue face (stands out on light bg) + paleSky text. Light: pacificBlue face + yaleBlue text.
  const face   = isDark ? C.yaleBlue     : C.pacificBlue;
  const shadow = isDark ? C.yaleBlue08   : C.yaleBlue08;
  const text   = isDark ? C.paleSky     : C.yaleBlue;

  // ── Entrance ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!btnRef.current) return;
    gsap.from(btnRef.current, {
      opacity: 0, y: 14, duration: 1, delay: 1.1, ease: "power3.out",
    });
  }, []);

  // ── Idle bounce ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (pressed || !btnRef.current) return;
    const el = btnRef.current;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(el, { y: -5, duration: 0.7 });
    return () => { tl.kill(); gsap.set(el, { y: 0 }); };
  }, [pressed]);

  // ── Arrow bob inside button ───────────────────────────────────────────────
  useEffect(() => {
    const el = arrowRef.current;
    if (!el) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, { y: 4, duration: 0.55, ease: "sine.inOut" });
    return () => {
      tl.kill();
      gsap.set(el, { y: 0 });
    };
  }, []);

  function handleClick() {
    if (!scrollTo) return;
    if (typeof scrollTo === "number") {
      window.scrollTo({ top: scrollTo, behavior: "smooth" });
    } else {
      // Validate: only allow ID selectors (e.g. #about, about) to prevent XSS
      const id = scrollTo.startsWith("#") ? scrollTo.slice(1) : scrollTo;
      if (/^[a-zA-Z][\w-]*$/.test(id)) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <>
      <div
        ref={btnRef}
        role="button"
        tabIndex={scrollTo ? 0 : -1}
        aria-label={scrollTo ? `${label} — scroll to next section` : label}
        className={className}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
          cursor: scrollTo ? "pointer" : "default",
          userSelect: "none",
          ...style,
        }}
      >
        {/* 3D button face */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: `linear-gradient(160deg, ${face}ee 0%, ${face} 100%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            /* 3D stacked shadow — the comical depth */
            boxShadow: pressed
              ? `0 1px 0 ${shadow}, 0 2px 0 ${shadow}cc`
              : `0 3px 0 ${shadow}, 0 5px 0 ${shadow}cc, 0 7px 0 ${shadow}88, 0 9px 12px ${shadow}55`,
            transform: pressed ? "translateY(6px)" : "translateY(0)",
            transition: "box-shadow 0.1s ease, transform 0.1s ease",
            border: `1.5px solid ${shadow}44`,
            position: "relative",
          }}
        >
          {/* Label */}
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: text,
            opacity: 0.75,
            lineHeight: 1,
          }}>
            {label}
          </span>

          {/* Animated arrow */}
          <div ref={arrowRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
            {/* shaft */}
            <div style={{
              width: "1.5px",
              height: "14px",
              background: text,
              borderRadius: "2px",
              opacity: 0.9,
            }} />
            {/* head */}
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
              <path
                d="M1 1L7 7L13 1"
                stroke={text}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Shine gloss on top */}
          <div style={{
            position: "absolute",
            top: "4px",
            left: "8px",
            right: "8px",
            height: "10px",
            borderRadius: "8px",
            background: `linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)`,
            pointerEvents: "none",
          }} />
        </div>
      </div>
    </>
  );
}
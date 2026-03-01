import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import C from "../../constants/colors";
export interface SectionHeadingProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  scrollTrigger?: boolean;
  delay?: number;
  align?: "left" | "center";
  className?: string;
}

function useTypewriter(text: string, start: boolean, speed = 36) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    setDisplayed(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [start, text, speed]);
  return { displayed, done };
}

export default function SectionAnimatedHeading({
  title,
  subtitle,
  eyebrow,
  scrollTrigger: useScroll = true,
  delay = 0,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  // One ref per word (not per char) — avoids clip-height issues entirely
  const wordsRef    = useRef<(HTMLSpanElement | null)[]>([]);

  const [subtitleStart, setSubtitleStart] = useState(false);
  const { displayed, done: subtitleDone } = useTypewriter(subtitle, subtitleStart, 36);

  const words = title.split(" ").filter(Boolean);

  useEffect(() => {
    const wordEls = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (wordEls.length === 0) return;

    const triggerCfg = useScroll
      ? { scrollTrigger: { trigger: wrapRef.current, start: "top 75%" } }
      : {};

    const tl = gsap.timeline({
      delay: delay / 1000,
      ...triggerCfg,
      onComplete: () => { setTimeout(() => setSubtitleStart(true), 80); },
    });

    if (eyebrowRef.current) {
      tl.from(eyebrowRef.current, {
        x: -18, opacity: 0, duration: 0.45, ease: "power2.out",
      }, 0);
    }

    // ── FIX: animate from y:40 (below baseline) upward, NO clip needed ──
    // Words start transparent + shifted down, rise into place
    tl.fromTo(
      wordEls,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: { each: 0.08, from: "start" },
      },
      eyebrow ? 0.2 : 0
    );

    if (lineRef.current) {
      tl.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: align === "center" ? "center" : "left",
        duration: 0.65,
        ease: "power3.inOut",
      }, "-=0.25");
    }

    return () => { tl.kill(); };
  }, [title, delay, useScroll, eyebrow, align]);

  // Blinking cursor
  const [cursorOn, setCursorOn] = useState(true);
  useEffect(() => {
    if (!subtitleStart) return;
    const id = setInterval(() => setCursorOn(v => !v), 520);
    if (subtitleDone) setTimeout(() => clearInterval(id), 1500);
    return () => clearInterval(id);
  }, [subtitleStart, subtitleDone]);

  return (
    <>
      <div ref={wrapRef} className={className} style={{ textAlign: align }}>

        {/* Eyebrow */}
        {eyebrow && (
          <div
            ref={eyebrowRef}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: align === "center" ? "center" : "flex-start",
              gap: "0.6rem",
              marginBottom: "0.85rem",
            }}
          >
            <div style={{ width: "1.6rem", height: "1.5px", background: C.pacificBlue }} />
            <span style={{
              fontSize: "0.7rem",
              letterSpacing: "0.28em",
              color: C.pacificBlue,
            }}>
              {eyebrow}
            </span>
          </div>
        )}

        {/* Title — word-by-word stagger, no overflow clip tricks */}
        <h2
          className="m-0"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
            display: "block",
          }}
        >
          {words.map((word, wi) => (
            <span
              key={wi}
              ref={el => { wordsRef.current[wi] = el; }}
              style={{
                display: "inline-block",
                color: wi % 2 === 0 ? C.yaleBlue : C.freshSky,
                marginRight: wi < words.length - 1 ? "0.22em" : 0,
              }}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Gradient underline */}
        <div
          ref={lineRef}
          style={{
            height: "2px",
            background: `linear-gradient(90deg, ${C.yaleBlue}, ${C.pacificBlue}, ${C.freshSky}, transparent)`,
            borderRadius: "2px",
          }}
        />

        {/* Subtitle — typewriter */}
        <p className="sn-pro" style={{
          fontStyle: "italic",
          fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
          color: C.freshSky,
          margin: 0,
          minHeight: "1.6em",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
        }}>
          {subtitleStart ? (
            <>
              {displayed}
              <span style={{
                display: "inline-block",
                width: "2px",
                height: "0.9em",
                background: C.pacificBlue,
                marginLeft: "2px",
                verticalAlign: "middle",
                opacity: cursorOn ? 1 : 0,
                transition: "opacity 0.1s",
                borderRadius: "1px",
              }} />
            </>
          ) : (
            <span style={{ opacity: 0 }}>{subtitle}</span>
          )}
        </p>
      </div>
    </>
  );
}
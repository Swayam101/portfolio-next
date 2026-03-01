import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LettersFadeInProps {
  lines: string[];
  className?: string;
  /** Semantic heading level for SEO (default: h2) */
  as?: "h1" | "h2" | "h3";
}

const LettersFadeIn = ({ lines, className = "", as: Tag = "h2" }: LettersFadeInProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll(".char");
    if (chars.length === 0) return;

    gsap.set(el, { opacity: 1 });

    const tl = gsap.timeline();
    tl.fromTo(
      chars,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.35,
        ease: "power1.out",
        stagger: { amount: 0.8 },
      }
    );
  }, []);

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ opacity: 0 }}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="word inline-block whitespace-pre">
          {line.split("").map((char, charIdx) => (
            <span key={`${lineIdx}-${charIdx}`} className="char inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
};

export default LettersFadeIn;

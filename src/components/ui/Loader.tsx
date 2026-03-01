import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Prevent scroll while loader is visible
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    const text = textRef.current;
    if (!bar || !text) return;

    const tl = gsap.timeline();

    // Text subtle fade-in
    tl.fromTo(text, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });

    // Progress bar fills over ~0.5s (shortened for LCP — was blocking content for 2.4s)
    tl.to(bar, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 0.15);

    // At 0.7s: fade out entire loader
    tl.to(
      ".loader-overlay",
      { opacity: 0, duration: 0.25, ease: "power2.in" },
      0.7
    );

    tl.call(() => setIsVisible(false), [], 0.95);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="loader-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--yale-blue)]"
      aria-hidden="true"
    >
      <div ref={textRef} className="mb-6 flex flex-col items-center">
        <span
          className="text-3xl font-bold tracking-wide sm:text-4xl"
          style={{ color: "var(--pale-sky)", fontFamily: "'AmericaN History Regular', sans-serif" }}
        >
          Swayam
        </span>
        <span
          className="text-3xl font-bold tracking-wide sm:text-4xl"
          style={{ color: "var(--pacific-blue)", fontFamily: "'AmericaN History Regular', sans-serif" }}
        >
          Prajapat
        </span>
      </div>

      {/* Progress bar track */}
      <div
        className="h-[3px] w-32 overflow-hidden rounded-full sm:w-40"
        style={{ backgroundColor: "rgba(var(--pacific-blue-rgb), 0.3)" }}
      >
        <div
          ref={barRef}
          className="h-full origin-left rounded-full"
          style={{
            width: "100%",
            backgroundColor: "var(--pale-sky)",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
};

export default Loader;

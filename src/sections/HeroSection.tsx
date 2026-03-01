import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import HeroBackground from "../components/hero-section/HeroBackground";
import LettersFadeIn from "../components/ui/LettersFadeIn";
import GoDownBtn from "../components/ui/GoDownBtn";

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const astronautRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    const astronaut = astronautRef.current;
    if (!section || !overlay) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Astronaut: slight fade-in on scroll (reverse of overlay — appears as hero exits)
    if (astronaut) {
      tl.fromTo(
        astronaut,
        { opacity: 0 },
        { opacity: 0.7, duration: 1.2, ease: "none" },
        0
      );
    }

    // Phase 1: Top exiting — light yale-blue tint (short)
    tl.fromTo(
      overlay,
      {
        opacity: 0,
        backgroundColor: "rgba(27, 73, 101, 0)",
      },
      {
        opacity: 1,
        backgroundColor: "rgba(27, 73, 101, 0.6)",
        duration: 0.2,
        ease: "none",
      },
      0
    );

    // Phase 2: Darken earlier (yale-blue)
    tl.to(
      overlay,
      {
        backgroundColor: "var(--yale-blue)",
        duration: 0.4,
        ease: "none",
      },
      ">"
    );

    return () => tl.scrollTrigger?.kill();
  }, []);

  return (
    <div
      id="hero"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center h-[calc(100vh-100px)] overflow-hidden px-6 sm:px-0"
    >
      <HeroBackground />

      {/* Astronaut: centered, behind text, fades in on scroll */}
      <div
        ref={astronautRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]"
        style={{ opacity: 0 }}
      >
        <Image
          src="/astronaut.webp"
          alt="Swayam Prajapat — Full-stack developer portfolio hero illustration"
          fill
          sizes="(max-width: 768px) 80vw, 50vw"
          className="object-contain"
          priority
          fetchPriority="high"
        />
      </div>

      <LettersFadeIn
        as="h1"
        lines={["I design it. ", "I build it. ", "I ship it. "]}
        className="relative z-10 text-[3.5rem] md:text-[4.2rem] font-bold text-[var(--yale-blue)] flex flex-col sm:flex-row items-center justify-center gap-[0px] sm:gap-8"
      />

      <GoDownBtn variant="dark" scrollTo="#about" className="absolute bottom-30 right-20 z-10" />

      {/* Scroll-triggered overlay: light when top exits, dark when fully out */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{ opacity: 0, backgroundColor: "transparent" }}
      />
    </div>
  );
};

export default HeroSection;

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Real images from your portfolio
const IMAGES = {
  astronaut: "/astronaut.webp",
  satellite: "/satellite.webp",
  cta: "/cta.webp",
};

type Skill = {
  title: string;
  icon: string;
  points: string[];
};

const SKILLS: Skill[] = [
  { title: "Web", icon: "🌐", points: ["Interfaces", "Products"] },
  { title: "Backend", icon: "⚙️", points: ["APIs", "Systems"] },
  { title: "AI", icon: "🤖", points: ["Agents", "Models"] },
  { title: "Automation", icon: "⚡", points: ["Workflows", "Things-that-do-things"] },
];

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="border-2 border-[var(--pacific-blue)] rounded-lg p-5 bg-white/40 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{skill.icon}</div>
        <h3 className="font-display font-bold text-lg text-[var(--yale-blue)]">{skill.title}</h3>
      </div>
      <ul className="text-[var(--yale-blue)] text-sm space-y-1">
        {skill.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span>•</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

const GRADIENT_START = `
  conic-gradient(
    from -45deg at bottom,
    transparent,
    rgba(27, 73, 101, 0) 1deg 89deg,
    var(--frozen-water) 90deg
  ) 50% / 80px 100%
`;
const GRADIENT_MID = `
  conic-gradient(
    from -45deg at bottom,
    transparent,
    rgba(27, 73, 101, 0.5) 1deg 89deg,
    var(--frozen-water) 90deg
  ) 50% / 80px 100%
`;
const GRADIENT_END = `
  conic-gradient(
    from -45deg at bottom,
    transparent,
    rgba(27, 73, 101, 1) 1deg 89deg,
    var(--frozen-water) 90deg
  ) 50% / 80px 100%
`;

export default function AboutMe() {
  const topGradientRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const astronautRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);

  // Zigzag transition matching hero section
  useEffect(() => {
    const hero = document.getElementById("hero");
    const topEl = topGradientRef.current;
    if (!hero || !topEl) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "center top",
        scrub: true,
      },
    });

    // Phase 1: Light tint
    tl.fromTo(
      [topEl],
      { background: GRADIENT_START },
      { background: GRADIENT_MID, duration: 1, ease: "none" },
      0
    );

    // Phase 2: Darken to yale-blue
    tl.to(
      [topEl],
      { background: GRADIENT_END, duration: 1.4, ease: "none" },
      ">"
    );

    return () => tl.scrollTrigger?.kill();
  }, []);

  // Image animations on scroll into view
  useEffect(() => {
    const section = sectionRef.current;
    const astronaut = astronautRef.current;
    const satellite = satelliteRef.current;
    const person = personRef.current;
    
    if (!section) return;

    // Astronaut - fade in from left
    if (astronaut) {
      gsap.fromTo(
        astronaut,
        { x: -100, opacity: 0, rotation: -5 },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );
    }

    // Satellite - fade in from top-right
    if (satellite) {
      gsap.fromTo(
        satellite,
        { x: 50, y: -50, opacity: 0, rotation: 10 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );
    }

    // Person - fade in from bottom-right
    if (person) {
      gsap.fromTo(
        person,
        { x: 50, y: 50, opacity: 0, rotation: -8 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative min-h-screen bg-[var(--frozen-water)] overflow-hidden">
      {/* Zigzag top transition matching hero */}
      <div
        ref={topGradientRef}
        className="absolute top-0 left-0 w-full h-10"
        style={{ background: GRADIENT_START }}
      />

      {/* Left - Big Astronaut */}
      <div
        ref={astronautRef}
        className="absolute left-4 md:left-8 top-1/3 -translate-y-1/3 w-64 md:w-80 lg:w-96 z-10"
        style={{ opacity: 0 }}
      >
        <Image
          src={IMAGES.astronaut}
          alt="Astronaut illustration"
          width={400}
          height={400}
          className="w-full h-auto object-contain drop-shadow-lg"
        />
      </div>

      {/* Right Top - Satellite */}
      <div
        ref={satelliteRef}
        className="absolute right-6 md:right-12 top-24 md:top-32 w-32 md:w-40 lg:w-48 z-10"
        style={{ opacity: 0 }}
      >
        <Image
          src={IMAGES.satellite}
          alt="Satellite illustration"
          width={200}
          height={200}
          className="w-full h-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Right Bottom - Person/CTA */}
      <div
        ref={personRef}
        className="absolute right-6 md:right-12 bottom-32 md:bottom-40 w-40 md:w-48 lg:w-56 z-10"
        style={{ opacity: 0 }}
      >
        <Image
          src={IMAGES.cta}
          alt="Character illustration"
          width={250}
          height={250}
          className="w-full h-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Sparkles */}
      <div className="absolute top-24 left-1/4 text-[var(--pacific-blue)] text-xl select-none">✦</div>
      <div className="absolute top-72 right-1/3 text-[var(--pacific-blue)] text-lg select-none hidden md:block">✦</div>
      <div className="absolute bottom-48 left-1/3 text-[var(--pacific-blue)] text-lg select-none">✦</div>

      {/* MAIN CONTENT */}
      <main className="relative z-20 max-w-3xl mx-auto px-6 pt-20 md:pt-24 pb-20 text-center">
        {/* Heading */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-[var(--yale-blue)] text-2xl -rotate-6 hidden sm:inline">↝</span>
          <h1 className="font-display font-extrabold text-[var(--yale-blue)] text-4xl md:text-6xl tracking-tight">
            About Me
          </h1>
          <span className="text-[var(--yale-blue)] text-2xl rotate-6 hidden sm:inline">↜</span>
        </div>

        {/* ID card */}
        <div className="relative mx-auto max-w-md mb-8">
          <span className="absolute -left-8 top-1/3 text-[var(--fresh-sky)] text-2xl hidden md:inline">⚡</span>
          <span className="absolute -right-8 top-1/3 text-[var(--fresh-sky)] text-2xl hidden md:inline">⚡</span>
          <div className="bg-[var(--yale-blue)] rounded-xl border-2 border-[var(--pacific-blue)] px-6 py-5 shadow-lg relative">
            <div className="absolute -top-2 left-8 w-4 h-4 bg-[var(--yale-blue)] rounded-sm border border-[var(--pacific-blue)]" />
            <div className="absolute -top-2 right-16 w-4 h-4 bg-[var(--yale-blue)] rounded-sm border border-[var(--pacific-blue)]" />
            <div className="absolute top-3 -right-1.5 w-3 h-8 bg-[var(--yale-blue)] rounded-sm border border-[var(--pacific-blue)]" />
            <div className="absolute top-1 right-6 w-2 h-2 bg-[var(--pacific-blue)] rounded-full" />
            <div className="divide-y divide-[var(--pacific-blue)]/40 text-left font-mono">
              <p className="py-1.5 text-sm md:text-base tracking-wide text-[var(--frozen-water)]">HUMAN / DEVELOPER</p>
              <p className="py-1.5 text-sm md:text-base tracking-wide text-[var(--pale-sky)] font-semibold">
                SWAYAM PRAJAPAT
              </p>
              <p className="py-1.5 text-sm md:text-base tracking-wide text-[var(--frozen-water)]">
                STATUS: BUILDING{" "}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 align-middle ml-1" />
              </p>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="font-display text-xl md:text-2xl text-[var(--yale-blue)] font-semibold mb-1">
          I make computers do useful things.
        </p>
        <svg className="mx-auto mb-10" width="180" height="12" viewBox="0 0 180 12">
          <path
            d="M2 6c15-8 30 8 45 0s30-8 45 0 30 8 45 0 30-8 40 0"
            stroke="var(--pacific-blue)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Skill cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mb-10">
          {SKILLS.map((skill) => (
            <SkillCard key={skill.title} skill={skill} />
          ))}
        </div>

        {/* Current obsession */}
        <div className="relative inline-block">
          <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-[var(--pacific-blue)] text-xl hidden sm:inline">
            ↝
          </span>
          <span className="absolute -right-7 top-1/2 -translate-y-1/2 text-[var(--pacific-blue)] text-xl hidden sm:inline">
            ↜
          </span>
          <div className="border-2 border-dashed border-[var(--pacific-blue)] rounded-full px-8 py-5 max-w-sm mx-auto">
            <p className="flex items-center justify-center gap-2 font-display font-bold text-[var(--yale-blue)] text-sm mb-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="var(--yale-blue)" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="1.5" fill="var(--yale-blue)" />
              </svg>
              CURRENT OBSESSION
            </p>
            <p className="text-[var(--yale-blue)] text-base">making software that works while I&apos;m not.</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M8 1v13M2 9l6 6 6-6"
              stroke="var(--yale-blue)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="w-9 h-9 rounded-full bg-[var(--yale-blue)] flex items-center justify-center">
            <span className="w-3 h-3 rounded-full border-2 border-[var(--pale-sky)]" />
          </div>
        </div>
      </main>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import type { Project } from "../types/project";
import MY_PROJECTS from "../data/projects";
import { ProjectRow } from "../components/projects-section/ProjectRow";
import { ProjectsSectionHeading } from "../components/projects-section/ProjectsSectionHeading";
import { ProjectsSectionFooter } from "../components/projects-section/ProjectsSectionFooter";
import AlternatingSlideIn from "../components/ui/AlternatingSlideIn";

interface ProjectsSectionProps {
  projects?: Project[];
  heading?: string;
  subheading?: string;
}

export default function ProjectsSection({
  projects = MY_PROJECTS,
  heading = "Craft Highlights",
  subheading = "Independent work. Enterprise standards.",
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 44,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
      });

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.3,
          ease: "power3.inOut",
          scrollTrigger: { trigger: lineRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = useCallback((i: number) => setActiveIndex(i), []);
  const handleLeave = useCallback(() => setActiveIndex(null), []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full relative overflow-hidden bg-[var(--frozen-water)] mt-72 px-6 sm:px-44"
    >
      {/* Subtle wave texture */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-50"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 0%, var(--pale-sky) 0%, transparent 60%)`,
        }}
      />

      {/* Decorative large watermark number */}
      <div
        className="absolute -right-8 top-1/2 -translate-y-1/2 font-['Bebas_Neue'] text-[28vw] leading-none pointer-events-none select-none tracking-[-0.05em]"
        style={{ color: "rgba(var(--pacific-blue-rgb),0.09)" }}
      >
        {String(projects.length).padStart(2, "0")}
      </div>

      <div className="max-w-full mx-auto relative">
        <ProjectsSectionHeading
          headingRef={headingRef}
          lineRef={lineRef}
          heading={heading}
          subheading={subheading}
        />

        {/* Rows — alternating slide-in from left/right */}
        <AlternatingSlideIn
          distance={100}
          stagger={0.1}
          duration={0.65}
          start="top 75%"
        >
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              isActive={activeIndex === i}
              onEnter={() => handleEnter(i)}
              onLeave={handleLeave}
            />
          ))}
        </AlternatingSlideIn>
        <div
          className="border-t-[1.5px]"
          style={{ borderColor: "rgba(var(--pacific-blue-rgb),0.33)" }}
        />

        <ProjectsSectionFooter />
      </div>
    </section>
  );
}

import { memo } from "react";
import Link from "next/link";
import type { Project } from "../../types/project";
import { useScramble } from "../../hooks/useScramble";

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

export const ProjectRow = memo(function ProjectRow({
  project,
  index,
  isActive,
  onEnter,
  onLeave,
}: ProjectRowProps) {
  const scrambled = useScramble(project.title, isActive);

  return (
    <Link
      href={project.slug ? `/projects/${project.slug}` : "#"}
      data-row
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative block no-underline cursor-pointer ease-out border-t-[1.5px] border-t-[rgba(var(--pacific-blue-rgb),0.33)] transition-all duration-[350ms] hover:scale-[1.01]"
      style={{
        background: isActive ? "var(--pale-sky)" : "transparent",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[2px] origin-top transition-transform duration-400"
        style={{
          background: "linear-gradient(180deg, var(--yale-blue), var(--fresh-sky))",
          transform: isActive ? "scaleY(1)" : "scaleY(0)",
          transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      <div className="flex flex-wrap items-start gap-4 sm:gap-7 py-7 pl-5 pr-6">
        {/* Index */}
        <div
          className="font-['Bebas_Neue'] text-[0.78rem] tracking-[0.1em] w-[1.8rem] shrink-0 pt-2 transition-colors duration-300 ease-out"
          style={{
            color: isActive ? "var(--pacific-blue)" : "rgba(var(--pacific-blue-rgb),0.4)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Main — fills remaining area after index */}
        <div className="flex-1 min-w-0">
          {/* Title + year */}
          <div className="flex items-baseline gap-4 mb-[0.55rem] flex-wrap">
            <h3
              className="font-['Bebas_Neue'] leading-none m-0 transition-colors duration-[250ms] ease-out"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.9rem)",
                letterSpacing: "0.05em",
                color: isActive ? "var(--yale-blue)" : "rgba(var(--yale-blue-rgb),0.73)",
              }}
            >
              {scrambled}
            </h3>
            <span className="font-['Lora'] text-[0.76rem] italic text-[var(--fresh-sky)] shrink-0">
              {project.year}
            </span>
          </div>

          {/* Description */}
          <div
            className="overflow-hidden transition-all duration-[450ms]"
            style={{
              maxHeight: isActive ? "90px" : "0",
              opacity: isActive ? 1 : 0,
              transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              marginBottom: isActive ? "0.85rem" : 0,
            }}
          >
            <p
              className="sn-pro text-[0.87rem] leading-[1.7] max-w-[540px] m-0"
              style={{ color: "rgba(var(--yale-blue-rgb),0.73)" }}
            >
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-[0.35rem]">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="font-['Bebas_Neue'] text-[0.7rem] tracking-[0.12em] px-[0.55rem] py-[0.18rem] rounded-[2px] transition-all duration-[250ms] ease-out"
                style={{
                  border: `1.5px solid ${isActive ? "var(--pacific-blue)" : "rgba(var(--pacific-blue-rgb),0.27)"}`,
                  color: isActive ? "var(--yale-blue)" : "var(--pacific-blue)",
                  background: isActive ? "rgba(var(--pacific-blue-rgb),0.12)" : "transparent",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow indicator on hover */}
        <div
          className="flex items-center shrink-0 pt-2 transition-all duration-350"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateX(0)" : "translateX(-10px)",
            transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--yale-blue)" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </Link>
  );
});

import type { RefObject } from "react";
import SectionAnimatedHeading from "../ui/SectionAnimatedHeading";

interface ProjectsSectionHeadingProps {
  headingRef: RefObject<HTMLDivElement | null>;
  lineRef: RefObject<HTMLDivElement | null>;
  heading: string;
  subheading: string;
}

export function ProjectsSectionHeading({
  headingRef,
  lineRef,
  heading,
  subheading,
}: ProjectsSectionHeadingProps) {
  return (
    <div ref={headingRef} className="mb-14">
      
      {/* Title */}
    <SectionAnimatedHeading title={heading} subtitle={subheading} delay={200} />

      {/* Gradient scan line */}
      <div
        ref={lineRef}
        className="h-0.5 w-full rounded-[2px]"
        style={{
          background: `linear-gradient(90deg, var(--yale-blue), var(--pacific-blue), var(--fresh-sky), var(--pale-sky))`,
        }}
      />
    </div>
  );
}

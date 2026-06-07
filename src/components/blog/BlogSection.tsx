// components/blog/BlogSection.tsx
import React from "react";
import type { BlogSection as BlogSectionType, BlogComponent } from "@/types/blog";
import {
  ImageBlock,
  StatStripResponsive,
  GridBlock,
  Callout,
  PullQuote,
} from "./BlogComponents";

interface Props {
  section: BlogSectionType;
  sectionIndex: number;
}

export function BlogSection({ section, sectionIndex }: Props) {
  const s = section.SECTION;
  const paragraphs = s.CONTENT.split(/\n\n+/).filter(Boolean);
  let imageCount = 0;

  const afterIntro = s.COMPONENTS.filter(
    (c) => c.type === "IMAGE" && (c as { PLACEMENT: string }).PLACEMENT === "after_intro"
  );
  const afterFirst = s.COMPONENTS.filter(
    (c) => c.type === "IMAGE" && (c as { PLACEMENT: string }).PLACEMENT === "after_first_para"
  );
  const rest = s.COMPONENTS.filter(
    (c) =>
      c.type !== "IMAGE" ||
      ((c as { PLACEMENT: string }).PLACEMENT !== "after_intro" &&
        (c as { PLACEMENT: string }).PLACEMENT !== "after_first_para")
  );

  const renderComponent = (comp: BlogComponent, key: number | string) => {
    switch (comp.type) {
      case "IMAGE":
        imageCount++;
        return <ImageBlock key={key} component={comp} figNum={imageCount} />;
      case "STAT_STRIP":
        return <StatStripResponsive key={key} component={comp} />;
      case "GRID":
        return <GridBlock key={key} component={comp} />;
      case "CALLOUT":
        return <Callout key={key} component={comp} />;
      case "PULL_QUOTE":
        return <PullQuote key={key} component={comp} />;
      default:
        return null;
    }
  };

  const sectionId = `s${sectionIndex + 1}`;
  const isFirst = sectionIndex === 0;

  return (
    <section id={sectionId} className={isFirst ? "" : "mt-10 sm:mt-14"}>
      {/* Section heading */}
      <div
        className={`mb-4 sm:mb-5 ${
          isFirst ? "" : "pt-8 sm:pt-10 border-t border-[#b8dede]"
        }`}
      >
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#5bbfbf] block mb-[7px]">
          § {s.NUM}
        </span>
        <h2
          className="font-serif font-bold text-[#1a2e3b] leading-[1.2] m-0"
          style={{ fontSize: "clamp(20px, 3.5vw, 26px)" }}
        >
          {s.TITLE}
        </h2>
      </div>

      {/* Components after_intro */}
      {afterIntro.map((c, i) => renderComponent(c, `ai-${i}`))}

      {/* Prose paragraphs */}
      {paragraphs.map((para, i) => (
        <React.Fragment key={i}>
          <p
            className={`mb-[1.4em] text-[#2e4a5a] leading-[1.8] ${
              s.DROP_CAP && i === 0 ? "drop-cap" : ""
            }`}
            style={{ fontSize: "clamp(16px, 2.2vw, 18px)" }}
          >
            {para}
          </p>
          {i === 0 && afterFirst.map((c, j) => renderComponent(c, `af-${j}`))}
        </React.Fragment>
      ))}

      {/* Rest of components */}
      {rest.map((c, i) => renderComponent(c, `rest-${i}`))}
    </section>
  );
}

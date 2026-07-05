"use client";

import { useMemo } from "react";
import { load as yamlLoad } from "js-yaml";

interface PreviewData {
  BLOG_TITLE?: string;
  KICKER?: string;
  SUBTITLE?: string;
  CLOSING_QUOTE?: string;
  SIDEBAR_TOC?: { NUM: string; TITLE: string }[];
  SECTIONS?: {
    SECTION: {
      NUM: string;
      TITLE: string;
      DROP_CAP: boolean;
      CONTENT: string;
      COMPONENTS?: unknown[];
    };
  }[];
}

function parseYamlSafe(raw: string): { data: PreviewData | null; error: string | null } {
  try {
    const data = yamlLoad(raw) as PreviewData;
    if (!data || typeof data !== "object") return { data: null, error: "Empty or invalid YAML" };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Parse error" };
  }
}

function normaliseComp(raw: Record<string, unknown>): { type: string; data: Record<string, unknown> } | null {
  if (typeof raw.type === "string") {
    return { type: raw.type.toUpperCase(), data: raw };
  }
  const key = Object.keys(raw).find((k) =>
    ["IMAGE", "STAT_STRIP", "GRID", "CALLOUT", "PULL_QUOTE"].includes(k.toUpperCase())
  );
  if (key) return { type: key.toUpperCase(), data: (raw[key] ?? {}) as Record<string, unknown> };
  return null;
}

function PreviewComponent({ comp, figNum }: { comp: Record<string, unknown>; figNum: number }) {
  const norm = normaliseComp(comp);
  if (!norm) return null;

  const { type, data: d } = norm;

  if (type === "IMAGE") {
    const title = ((d.CAPTION ?? d.TITLE) as string) ?? "";
    const desc = (d.DESCRIPTION as string) ?? "";
    const aspect = (d.ASPECT as string) ?? "wide";
    const aspectW = aspect === "hero" ? "16/9" : aspect === "square" ? "1/1" : "3/2";
    return (
      <div style={{ margin: "16px 0", border: "1px solid #c8e8e8", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ background: "#d4f0f0", aspectRatio: aspectW, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6a8a9a", textAlign: "center", padding: 12 }}>
            {desc || title || "Image"}
          </span>
        </div>
        <div style={{ padding: "8px 12px", background: "#f2fafa", borderTop: "1px solid #c8e8e8" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#6a8a9a" }}>
            Fig. {figNum} — {title}
          </span>
        </div>
      </div>
    );
  }

  if (type === "STAT_STRIP") {
    const stats = (d.STATS as { NUM?: string; VALUE?: string; LABEL?: string }[]) ?? [];
    return (
      <div style={{ margin: "16px 0", display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: 1, background: "#c8e8e8", border: "1px solid #c8e8e8", borderRadius: 4, overflow: "hidden" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#f2fafa", padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 22, fontWeight: 900, color: "#1a2e3b" }}>
              {s.NUM ?? s.VALUE ?? ""}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#6a8a9a", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {s.LABEL ?? ""}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "GRID") {
    const items = (d.ITEMS as { NUM?: string; LABEL?: string; TITLE?: string; BODY?: string }[]) ?? [];
    return (
      <div style={{ margin: "16px 0", display: "grid", gridTemplateColumns: items.length === 1 ? "1fr" : "1fr 1fr", gap: 1, background: "#c8e8e8", border: "1px solid #c8e8e8", borderRadius: 4, overflow: "hidden" }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: "#f2fafa", padding: 16, position: "relative" }}>
            <span style={{ position: "absolute", top: 4, right: 8, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 36, fontWeight: 900, color: "#e2f3f3" }}>
              {item.NUM ?? ""}
            </span>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#5bbfbf", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
              {item.LABEL ?? ""}
            </div>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, fontWeight: 700, color: "#1a2e3b", marginBottom: 4 }}>
              {item.TITLE ?? ""}
            </div>
            <div style={{ fontSize: 12, color: "#4a6a7a", lineHeight: 1.5 }}>
              {item.BODY ?? ""}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "CALLOUT") {
    const style = (d.STYLE as string) ?? "gold";
    const text = (d.TEXT as string) ?? "";
    return (
      <div style={{ margin: "16px 0", padding: "14px 16px", background: "#edf8f8", borderLeft: `4px solid ${style === "red" ? "#1a2e3b" : "#d4891a"}`, borderRadius: 2 }}>
        <p style={{ margin: 0, fontSize: 14, color: "#1a2e3b", lineHeight: 1.6 }}>{text}</p>
      </div>
    );
  }

  if (type === "PULL_QUOTE") {
    const text = (d.TEXT as string) ?? "";
    return (
      <div style={{ margin: "16px 0", padding: "18px 20px 18px 28px", background: "#1a2e3b", borderRadius: 4, position: "relative" }}>
        <span style={{ position: "absolute", top: 4, left: 8, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 56, color: "#5bbfbf", opacity: 0.6, lineHeight: 1 }}>
          &ldquo;
        </span>
        <p style={{ margin: 0, fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic", fontSize: 15, color: "#d4f0f0", lineHeight: 1.6, position: "relative" }}>
          {text}
        </p>
      </div>
    );
  }

  return null;
}

function RenderSection({ s, isFirst, figCounter }: { s: PreviewData["SECTIONS"] extends (infer T)[] | undefined ? T : never; isFirst: boolean; figCounter: { value: number } }) {
  const sec = s.SECTION;
  const paragraphs = (sec.CONTENT ?? "").split(/\n\n+/).filter(Boolean);
  const components = (sec.COMPONENTS ?? []) as Record<string, unknown>[];

  const imageComponents: { comp: Record<string, unknown>; fig: number }[] = [];
  const nonImageComponents: { comp: Record<string, unknown>; index: number }[] = [];

  for (const comp of components) {
    const norm = normaliseComp(comp);
    if (norm?.type === "IMAGE") {
      figCounter.value++;
      imageComponents.push({ comp, fig: figCounter.value });
    } else {
      nonImageComponents.push({ comp, index: nonImageComponents.length });
    }
  }

  const imageByPlacement = new Map<string, { comp: Record<string, unknown>; fig: number }[]>();
  for (const ic of imageComponents) {
    const norm = normaliseComp(ic.comp);
    const placement = (norm?.data.PLACEMENT as string) ?? "end_of_section";
    if (!imageByPlacement.has(placement)) imageByPlacement.set(placement, []);
    imageByPlacement.get(placement)!.push(ic);
  }

  const afterIntro = imageByPlacement.get("after_intro") ?? [];
  const afterFirst = imageByPlacement.get("after_first_para") ?? [];
  const endOfSection = imageByPlacement.get("end_of_section") ?? [];
  const rest = imageComponents.filter(
    (ic) => {
      const norm = normaliseComp(ic.comp);
      const p = (norm?.data.PLACEMENT as string) ?? "end_of_section";
      return p !== "after_intro" && p !== "after_first_para" && p !== "end_of_section";
    }
  );

  let nonImageIdx = 0;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5bbfbf" }}>
          § {sec.NUM}
        </span>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1a2e3b", margin: "4px 0 0", lineHeight: 1.2 }}>
          {sec.TITLE}
        </h3>
      </div>

      {afterIntro.map((ic) => (
        <PreviewComponent key={`ai-${ic.fig}`} comp={ic.comp} figNum={ic.fig} />
      ))}

      {paragraphs.map((para, i) => (
        <div key={i}>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: "#2e4a5a",
              margin: "0 0 1.2em",
              ...(isFirst && i === 0 ? { fontWeight: 600 } : {}),
            }}
          >
            {para}
          </p>
          {i === 0 && afterFirst.map((ic) => (
            <PreviewComponent key={`af-${ic.fig}`} comp={ic.comp} figNum={ic.fig} />
          ))}
          {i === 0 && nonImageComponents.length > 0 && (
            <>
              {nonImageComponents.map((nc) => {
                const idx = nonImageIdx++;
                return <PreviewComponent key={`nc-${idx}`} comp={nc.comp} figNum={0} />;
              })}
            </>
          )}
        </div>
      ))}

      {paragraphs.length === 0 && nonImageComponents.map((nc, idx) => (
        <PreviewComponent key={`nc-${idx}`} comp={nc.comp} figNum={0} />
      ))}

      {endOfSection.map((ic) => (
        <PreviewComponent key={`eos-${ic.fig}`} comp={ic.comp} figNum={ic.fig} />
      ))}
      {rest.map((ic) => (
        <PreviewComponent key={`r-${ic.fig}`} comp={ic.comp} figNum={ic.fig} />
      ))}
    </div>
  );
}

export function YamlPreview({ yaml }: { yaml: string }) {
  const { data, error } = useMemo(() => parseYamlSafe(yaml), [yaml]);

  if (error) {
    return (
      <div style={{ padding: 20, fontFamily: "monospace", fontSize: 12, color: "#cb6666" }}>
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 20, fontFamily: "monospace", fontSize: 12, color: "#4a6a7a" }}>
        Nothing to preview
      </div>
    );
  }

  const sections = data.SECTIONS ?? [];
  const figCounter = { value: 0 };

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      {data.KICKER && (
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8dd9d9", marginBottom: 8 }}>
          {data.KICKER}
        </div>
      )}
      {data.BLOG_TITLE && (
        <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 28, fontWeight: 900, color: "#1a2e3b", lineHeight: 1.1, margin: "0 0 12px" }}>
          {data.BLOG_TITLE}
        </h1>
      )}
      {data.SUBTITLE && (
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, fontStyle: "italic", color: "#4a6a7a", margin: "0 0 24px", paddingLeft: 14, borderLeft: "2px solid #5bbfbf" }}>
          {data.SUBTITLE}
        </p>
      )}

      {data.SIDEBAR_TOC && data.SIDEBAR_TOC.length > 0 && (
        <div style={{ marginBottom: 24, padding: "10px 14px", background: "#edf8f8", border: "1px solid #c8e8e8", borderRadius: 4 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5bbfbf", marginBottom: 6 }}>Contents</div>
          {data.SIDEBAR_TOC.map((item, i) => (
            <div key={i} style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 13, color: "#2e4a5a", padding: "3px 0" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "#5bbfbf", marginRight: 8 }}>{item.NUM}</span>
              {item.TITLE}
            </div>
          ))}
        </div>
      )}

      {sections.map((s, i) => (
        <RenderSection key={i} s={s} isFirst={i === 0} figCounter={figCounter} />
      ))}

      {data.CLOSING_QUOTE && (
        <div style={{ marginTop: 32, padding: "20px 24px", background: "#1a2e3b", borderRadius: 4, textAlign: "center" }}>
          <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 17, fontStyle: "italic", color: "#d4f0f0", lineHeight: 1.5, margin: 0 }}>
            &ldquo;{data.CLOSING_QUOTE}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

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

function RenderSection({ s, isFirst }: { s: PreviewData["SECTIONS"] extends (infer T)[] | undefined ? T : never; isFirst: boolean }) {
  const sec = s.SECTION;
  const paragraphs = (sec.CONTENT ?? "").split(/\n\n+/).filter(Boolean);

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
      {paragraphs.map((para, i) => (
        <p
          key={i}
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
      ))}
      {(sec.COMPONENTS ?? []).length > 0 && (
        <div style={{ margin: "12px 0", padding: "8px 12px", background: "#edf8f8", borderLeft: "3px solid #5bbfbf", borderRadius: 2, fontFamily: "monospace", fontSize: 11, color: "#4a6a7a" }}>
          {(sec.COMPONENTS ?? []).length} component(s)
        </div>
      )}
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

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      {/* Hero */}
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

      {/* Sidebar TOC */}
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

      {/* Sections */}
      {sections.map((s, i) => (
        <RenderSection key={i} s={s} isFirst={i === 0} />
      ))}

      {/* Closing quote */}
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

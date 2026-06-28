"use client";

import type { Series } from "../types";
import { S } from "../styles";

interface Props {
  series: Series[];
  onRefresh: () => void;
  onEditPost: (slug: string) => void;
}

export function SeriesView({ series, onRefresh, onEditPost }: Props) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={S.sectionTitle}>Series</h1>
          <div style={S.muted}>{series.length} series</div>
        </div>
        <button onClick={onRefresh} style={S.btn}>REFRESH</button>
      </div>

      {series.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#4a6a7a" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.12em", marginBottom: 8 }}>NO SERIES</div>
          <div style={{ fontSize: 13, fontFamily: "monospace" }}>Assign a seriesSlug to posts to group them.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {series.map((s) => (
            <div key={s.seriesSlug} style={{ background: "#111f2a", border: "1px solid rgba(91,191,191,0.1)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(91,191,191,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.08em", color: "#5bbfbf" }}>{s.seriesSlug}</div>
                  {s.seriesDescription && <div style={{ fontSize: 13, color: "#6a8a9a", marginTop: 4, fontStyle: "italic" }}>{s.seriesDescription}</div>}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, fontFamily: "monospace" }}>
                  <span style={{ color: "#8aaab8" }}>{s.postCount} post{s.postCount !== 1 ? "s" : ""}</span>
                  {s.unparseableCount > 0 && <span style={{ color: "#cb6666" }}>{s.unparseableCount} unparseable</span>}
                </div>
              </div>
              <div style={{ padding: "8px 12px" }}>
                {s.posts.map((p, i) => (
                  <div key={p.slug}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 3, transition: "background 0.1s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(91,191,191,0.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4a6a7a", width: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontSize: 14, color: "#d4f0f0" }}>{p.BLOG_TITLE}</span>
                    </div>
                    <button onClick={() => onEditPost(p.slug)}
                      style={{ padding: "4px 10px", background: "rgba(91,191,191,0.08)", border: "1px solid rgba(91,191,191,0.15)", borderRadius: 3, color: "#5bbfbf", fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

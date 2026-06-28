"use client";

import type { Post, Series } from "../types";
import { S } from "../styles";

interface Props {
  posts: Post[];
  total: number;
  loading: boolean;
  search: string;
  filterSeries: string;
  series: Series[];
  onSearchChange: (v: string) => void;
  onSeriesChange: (v: string) => void;
  onEdit: (slug?: string) => void;
  onToggleActive: (slug: string, currentActive: boolean) => void;
  onNew: () => void;
}

export function DashboardView({
  posts, total, loading, search, filterSeries, series,
  onSearchChange, onSeriesChange, onEdit, onToggleActive, onNew,
}: Props) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={S.sectionTitle}>Posts</h1>
          <div style={S.muted}>{total} total</div>
        </div>
        <button onClick={onNew} style={{ ...S.btnPrimary, padding: "9px 20px", fontSize: 14 }}>
          + NEW POST
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          type="text" placeholder="Search posts..." value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ ...S.input, flex: 1 }}
        />
        <select
          value={filterSeries} onChange={(e) => onSeriesChange(e.target.value)}
          style={{ ...S.input, cursor: "pointer", minWidth: 160 }}
        >
          <option value="">All series</option>
          {series.map((s) => (
            <option key={s.seriesSlug} value={s.seriesSlug}>{s.seriesSlug} ({s.postCount})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#4a6a7a", fontFamily: "monospace", fontSize: 13 }}>
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#4a6a7a" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.12em", marginBottom: 8 }}>NO POSTS</div>
          <div style={{ fontSize: 13, fontFamily: "monospace" }}>Create your first post to get started.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {posts.map((post) => (
            <div
              key={post.slug}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: "#111f2a", border: "1px solid rgba(91,191,191,0.08)", borderRadius: 4, transition: "border-color 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(91,191,191,0.25)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(91,191,191,0.08)"; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#d4f0f0", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.BLOG_TITLE || post.slug}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, fontFamily: "monospace", color: "#4a6a7a" }}>
                  <span>{post.slug}</span>
                  {post.date && <span>· {post.date}</span>}
                  {post.seriesSlug && <span style={{ color: "#5bbfbf" }}>· {post.seriesSlug}</span>}
                  {post.category && <span style={{ color: "#5bbfbf" }}>· {post.category}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                <span style={{
                  fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", padding: "4px 8px", borderRadius: 3,
                  background: post.active ? "rgba(91,191,191,0.12)" : "rgba(203,102,102,0.1)",
                  color: post.active ? "#5bbfbf" : "#cb6666",
                  border: `1px solid ${post.active ? "rgba(91,191,191,0.25)" : "rgba(203,102,102,0.2)"}`,
                }}>
                  {post.active ? "ACTIVE" : "INACTIVE"}
                </span>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "6px 12px", background: "rgba(91,191,191,0.1)", border: "1px solid rgba(91,191,191,0.2)", borderRadius: 3, color: "#8aaab8", fontSize: 11, fontFamily: "monospace", textDecoration: "none", cursor: "pointer" }}>
                  View
                </a>
                <button onClick={() => onEdit(post.slug)}
                  style={{ padding: "6px 12px", background: "rgba(91,191,191,0.1)", border: "1px solid rgba(91,191,191,0.2)", borderRadius: 3, color: "#5bbfbf", fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => onToggleActive(post.slug, post.active)}
                  style={{
                    padding: "6px 12px", borderRadius: 3, fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                    background: post.active ? "rgba(203,102,102,0.08)" : "rgba(91,191,191,0.08)",
                    border: `1px solid ${post.active ? "rgba(203,102,102,0.2)" : "rgba(91,191,191,0.2)"}`,
                    color: post.active ? "#cb6666" : "#5bbfbf",
                  }}>
                  {post.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

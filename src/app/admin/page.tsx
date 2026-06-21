"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

interface Post {
  slug: string;
  BLOG_TITLE: string;
  KICKER: string;
  SUBTITLE: string;
  READ_TIME: string;
  TAGS: string;
  DATE?: string;
  seriesSlug?: string;
  active: boolean;
}

interface Series {
  seriesSlug: string;
  seriesDescription: string;
  postCount: number;
  unparseableCount: number;
  posts: { slug: string; BLOG_TITLE: string }[];
}

interface RawPost {
  slug: string;
  yaml: string;
  seriesSlug?: string;
  seriesDescription?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

type View = "dashboard" | "editor" | "series" | "generate";

const EMPTY_YAML = `BLOG_TITLE: ""
KICKER: ""
SUBTITLE: ""
READ_TIME: "X min read"
TAGS: ""
DATE: ""
CLOSING_QUOTE: ""
SIDEBAR_TOC:
  - NUM: "I"
    TITLE: "Introduction"
SECTIONS:
  - SECTION:
      NUM: "I"
      TITLE: "Introduction"
      DROP_CAP: true
      CONTENT: |
        Write your first paragraph here.
      COMPONENTS: []
`;

const SCHEMA_PROMPT = `You are a blog post YAML generator. Given raw blog content (text, outline, or notes), convert it into the exact YAML schema below. Output ONLY the YAML string — no markdown fences, no explanation.

## YAML Schema

BLOG_TITLE: "The main visible headline"
KICKER: "Category · Tag (e.g. Deep Dive · Engineering)"
SUBTITLE: "A hook or subtitle beneath the title"
READ_TIME: "X min read"
TAGS: "Tag1 · Tag2 · Tag3"
DATE: "Month Year (e.g. June 2025)"
CLOSING_QUOTE: "A powerful quote to end the post"
SEO_TITLE: "Optional: < 60 chars for search engines"
SEO_DESCRIPTION: "Optional: < 160 chars for search snippets"
OG_IMAGE: ""
SIDEBAR_TOC:
  - NUM: "I"
    TITLE: "Section Name"
SECTIONS:
  - SECTION:
      NUM: "I"
      TITLE: "Section Name"
      DROP_CAP: true
      CONTENT: |
        Paragraph one.

        Paragraph two (blank line between paragraphs).
      COMPONENTS: []

## Rules

1. BLOG_TITLE, KICKER, SUBTITLE, READ_TIME, TAGS, CLOSING_QUOTE are REQUIRED.
2. DATE defaults to current month/year if not provided.
3. SECTIONS use Roman numerals (I, II, III, IV, V…).
4. SIDEBAR_TOC must mirror section titles exactly.
5. Only FIRST section has DROP_CAP: true.
6. CONTENT uses YAML literal block (|). Separate paragraphs with blank lines.
7. COMPONENTS are optional — use only when natural:
   - STAT_STRIP: numerical data (2-4 stats)
   - CALLOUT: key takeaways (gold or red)
   - PULL_QUOTE: strong extracted quote
   - GRID: compare 2-4 items (NUM, LABEL, TITLE, BODY)
   - IMAGE: placeholder SRC "https://example.com/placeholder-image-[N].jpg"
8. Generate 3-5 sections depending on content length.
9. Read time: ~200 words per minute.
10. Tags: 2-4 tags separated by " · ".
11. KICKER format: "Category · Tag"`;

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [posts, setPosts] = useState<Post[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSeries, setFilterSeries] = useState("");
  const [total, setTotal] = useState(0);

  // Editor state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [yaml, setYaml] = useState(EMPTY_YAML);
  const [newSlug, setNewSlug] = useState("");
  const [seriesSlug, setSeriesSlug] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [editingActive, setEditingActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    error?: string;
    details?: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Generator state
  const [genInput, setGenInput] = useState("");

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    }),
    [apiKey]
  );

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filterSeries) params.set("series", filterSeries);
      params.set("all", "true");
      params.set("limit", "50");

      const res = await fetch(`/api/blog?${params}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();

      const allPosts: Post[] = [];
      for (const s of data.series) {
        for (const p of s.posts) allPosts.push(p);
      }
      for (const p of data.standalone) allPosts.push(p);
      setPosts(allPosts);
      setTotal(data.total);
    } catch {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterSeries, headers, showToast]);

  const fetchSeries = useCallback(async () => {
    try {
      const res = await fetch("/api/blog/series", { headers });
      if (!res.ok) throw new Error("Failed to fetch series");
      const data = await res.json();
      setSeries(data.series);
    } catch {
      showToast("Failed to load series", "error");
    }
  }, [headers, showToast]);

  useEffect(() => {
    if (authenticated) {
      fetchPosts();
      fetchSeries();
    }
  }, [authenticated, fetchPosts, fetchSeries]);

  useEffect(() => {
    if (authenticated) fetchPosts();
  }, [debouncedSearch, filterSeries, authenticated, fetchPosts]);

  const handleLogin = () => {
    if (apiKey.trim()) setAuthenticated(true);
  };

  const openEditor = async (slug?: string) => {
    if (slug) {
      try {
        const res = await fetch(`/api/blog/raw/${slug}`, { headers });
        if (!res.ok) throw new Error("Failed to fetch post");
        const data: RawPost = await res.json();
        setEditingSlug(slug);
        setYaml(data.yaml);
        setNewSlug(slug);
        setSeriesSlug(data.seriesSlug || "");
        setSeriesDescription(data.seriesDescription || "");
        setEditingActive(data.active);
      } catch {
        showToast("Failed to load post", "error");
        return;
      }
    } else {
      setEditingSlug(null);
      setYaml(EMPTY_YAML);
      setNewSlug("");
      setSeriesSlug("");
      setSeriesDescription("");
      setEditingActive(true);
    }
    setValidationResult(null);
    setView("editor");
  };

  const handleValidate = async () => {
    setValidating(true);
    setValidationResult(null);
    try {
      const res = await fetch("/api/blog/validate", {
        method: "POST",
        headers,
        body: JSON.stringify({ yaml }),
      });
      const data = await res.json();
      setValidationResult(data);
      if (data.valid) {
        showToast("YAML is valid", "success");
      }
    } catch {
      setValidationResult({ valid: false, error: "Validation request failed" });
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    if (!newSlug.trim()) {
      showToast("Slug is required", "error");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, string> = {
        slug: newSlug.trim(),
        yaml,
      };
      if (seriesSlug.trim()) body.seriesSlug = seriesSlug.trim();
      if (seriesDescription.trim())
        body.seriesDescription = seriesDescription.trim();

      const res = await fetch("/api/blog", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to save", "error");
        return;
      }

      showToast(
        editingSlug ? "Post updated successfully" : "Post created successfully",
        "success"
      );
      setEditingSlug(data.slug);
      fetchPosts();
      fetchSeries();
    } catch {
      showToast("Failed to save post", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slug: string, currentActive: boolean) => {
    const newActive = !currentActive;
    const action = newActive ? "activate" : "deactivate";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${slug}"?`))
      return;

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ active: newActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      showToast(
        newActive ? "Post activated" : "Post deactivated",
        "success"
      );
      fetchPosts();
      fetchSeries();
    } catch {
      showToast(`Failed to ${action} post`, "error");
    }
  };

  const handleGenerateCopy = () => {
    const combined = `${SCHEMA_PROMPT}\n\n---\n\nBLOG CONTENT:\n\n${genInput}`;
    navigator.clipboard.writeText(combined);
    showToast("Prompt + content copied to clipboard", "success");
  };

  const handleUseInEditor = () => {
    const combined = `${SCHEMA_PROMPT}\n\n---\n\nBLOG CONTENT:\n\n${genInput}`;
    setYaml(combined);
    setEditingSlug(null);
    setNewSlug("");
    setValidationResult(null);
    setView("editor");
  };

  if (!authenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d1b24",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'SN Pro', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            padding: "2.5rem 2rem",
            background: "#1a2e3b",
            border: "1px solid rgba(91,191,191,0.2)",
            borderRadius: 8,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.6rem",
                letterSpacing: "0.14em",
                color: "#5bbfbf",
                marginBottom: 6,
              }}
            >
              ADMIN
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#6a8a9a",
                fontFamily: "monospace",
                letterSpacing: "0.08em",
              }}
            >
              Blog Management Panel
            </div>
          </div>

          <label
            style={{
              display: "block",
              fontSize: 10,
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8aaab8",
              marginBottom: 8,
            }}
          >
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter your API key"
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "#0d1b24",
              border: "1px solid rgba(91,191,191,0.25)",
              borderRadius: 4,
              color: "#d4f0f0",
              fontSize: 14,
              fontFamily: "monospace",
              outline: "none",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "11px 0",
              background: "#5bbfbf",
              border: "none",
              borderRadius: 4,
              color: "#0d1b24",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 15,
              letterSpacing: "0.16em",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            ENTER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1b24",
        color: "#d4f0f0",
        fontFamily: "'SN Pro', sans-serif",
        display: "flex",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
            padding: "12px 20px",
            borderRadius: 6,
            background: toast.type === "success" ? "#1a4a3a" : "#4a1a1a",
            border: `1px solid ${toast.type === "success" ? "#5bbfbf" : "#cb6666"}`,
            color: toast.type === "success" ? "#5bbfbf" : "#cb6666",
            fontFamily: "monospace",
            fontSize: 13,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#111f2a",
          borderRight: "1px solid rgba(91,191,191,0.12)",
          padding: "24px 0",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "0 20px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 20,
              letterSpacing: "0.14em",
              color: "#5bbfbf",
            }}
          >
            SWAYAM
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              letterSpacing: "0.12em",
              color: "#4a6a7a",
              marginTop: 2,
            }}
          >
            ADMIN PANEL
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {(
            [
              { id: "dashboard", label: "Posts", icon: "◻" },
              { id: "generate", label: "Generate", icon: "⚡" },
              { id: "editor", label: "Editor", icon: "✎" },
              { id: "series", label: "Series", icon: "▤" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "editor" && !editingSlug) openEditor();
                else setView(item.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 20px",
                background:
                  view === item.id
                    ? "rgba(91,191,191,0.1)"
                    : "transparent",
                border: "none",
                borderLeft:
                  view === item.id
                    ? "2px solid #5bbfbf"
                    : "2px solid transparent",
                color: view === item.id ? "#5bbfbf" : "#6a8a9a",
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(91,191,191,0.1)",
          }}
        >
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              fontSize: 11,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              color: "#4a6a7a",
              textDecoration: "none",
              marginBottom: 8,
            }}
          >
            View Blog →
          </a>
          <button
            onClick={() => setAuthenticated(false)}
            style={{
              display: "block",
              fontSize: 11,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              color: "#cb6666",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>
        {view === "dashboard" && (
          <Dashboard
            posts={posts}
            total={total}
            loading={loading}
            search={search}
            filterSeries={filterSeries}
            series={series}
            onSearchChange={setSearch}
            onSeriesChange={setFilterSeries}
            onEdit={openEditor}
            onToggleActive={handleToggleActive}
            onNew={() => openEditor()}
          />
        )}
        {view === "editor" && (
          <Editor
            editingSlug={editingSlug}
            yaml={yaml}
            newSlug={newSlug}
            seriesSlug={seriesSlug}
            seriesDescription={seriesDescription}
            active={editingActive}
            validationResult={validationResult}
            saving={saving}
            validating={validating}
            onYamlChange={setYaml}
            onSlugChange={setNewSlug}
            onSeriesSlugChange={setSeriesSlug}
            onSeriesDescChange={setSeriesDescription}
            onValidate={handleValidate}
            onSave={handleSave}
            onBack={() => setView("dashboard")}
          />
        )}
        {view === "series" && (
          <SeriesManager
            series={series}
            onRefresh={fetchSeries}
            onEditPost={openEditor}
          />
        )}
        {view === "generate" && (
          <Generator
            input={genInput}
            onInputChange={setGenInput}
            onCopy={handleGenerateCopy}
            onUseInEditor={handleUseInEditor}
          />
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: #5bbfbf !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,191,191,0.2); border-radius: 3px; }
      `}</style>
    </div>
  );
}

function Dashboard({
  posts,
  total,
  loading,
  search,
  filterSeries,
  series,
  onSearchChange,
  onSeriesChange,
  onEdit,
  onToggleActive,
  onNew,
}: {
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
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              letterSpacing: "0.08em",
              color: "#d4f0f0",
              margin: 0,
            }}
          >
            Posts
          </h1>
          <div
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "#4a6a7a",
              marginTop: 4,
            }}
          >
            {total} total
          </div>
        </div>
        <button
          onClick={onNew}
          style={{
            padding: "9px 20px",
            background: "#5bbfbf",
            border: "none",
            borderRadius: 4,
            color: "#0d1b24",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 14,
            letterSpacing: "0.12em",
            cursor: "pointer",
          }}
        >
          + NEW POST
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            flex: 1,
            padding: "9px 14px",
            background: "#111f2a",
            border: "1px solid rgba(91,191,191,0.18)",
            borderRadius: 4,
            color: "#d4f0f0",
            fontSize: 13,
            fontFamily: "monospace",
            outline: "none",
          }}
        />
        <select
          value={filterSeries}
          onChange={(e) => onSeriesChange(e.target.value)}
          style={{
            padding: "9px 14px",
            background: "#111f2a",
            border: "1px solid rgba(91,191,191,0.18)",
            borderRadius: 4,
            color: "#d4f0f0",
            fontSize: 13,
            fontFamily: "monospace",
            outline: "none",
            cursor: "pointer",
            minWidth: 160,
          }}
        >
          <option value="">All series</option>
          {series.map((s) => (
            <option key={s.seriesSlug} value={s.seriesSlug}>
              {s.seriesSlug} ({s.postCount})
            </option>
          ))}
        </select>
      </div>

      {/* Post list */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "#4a6a7a",
            fontFamily: "monospace",
            fontSize: 13,
          }}
        >
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#4a6a7a",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: "0.12em",
              marginBottom: 8,
            }}
          >
            NO POSTS
          </div>
          <div style={{ fontSize: 13, fontFamily: "monospace" }}>
            Create your first post to get started.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {posts.map((post) => (
            <div
              key={post.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 16px",
                background: "#111f2a",
                border: "1px solid rgba(91,191,191,0.08)",
                borderRadius: 4,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(91,191,191,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(91,191,191,0.08)";
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#d4f0f0",
                    marginBottom: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.BLOG_TITLE || post.slug}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: "#4a6a7a",
                  }}
                >
                  <span>{post.slug}</span>
                  {post.DATE && <span>· {post.DATE}</span>}
                  {post.seriesSlug && (
                    <span style={{ color: "#5bbfbf" }}>
                      · {post.seriesSlug}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    padding: "4px 8px",
                    borderRadius: 3,
                    background: post.active ? "rgba(91,191,191,0.12)" : "rgba(203,102,102,0.1)",
                    color: post.active ? "#5bbfbf" : "#cb6666",
                    border: `1px solid ${post.active ? "rgba(91,191,191,0.25)" : "rgba(203,102,102,0.2)"}`,
                  }}
                >
                  {post.active ? "ACTIVE" : "INACTIVE"}
                </span>
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 12px",
                    background: "rgba(91,191,191,0.1)",
                    border: "1px solid rgba(91,191,191,0.2)",
                    borderRadius: 3,
                    color: "#8aaab8",
                    fontSize: 11,
                    fontFamily: "monospace",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  View
                </a>
                <button
                  onClick={() => onEdit(post.slug)}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(91,191,191,0.1)",
                    border: "1px solid rgba(91,191,191,0.2)",
                    borderRadius: 3,
                    color: "#5bbfbf",
                    fontSize: 11,
                    fontFamily: "monospace",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleActive(post.slug, post.active)}
                  style={{
                    padding: "6px 12px",
                    background: post.active
                      ? "rgba(203,102,102,0.08)"
                      : "rgba(91,191,191,0.08)",
                    border: `1px solid ${post.active ? "rgba(203,102,102,0.2)" : "rgba(91,191,191,0.2)"}`,
                    borderRadius: 3,
                    color: post.active ? "#cb6666" : "#5bbfbf",
                    fontSize: 11,
                    fontFamily: "monospace",
                    cursor: "pointer",
                  }}
                >
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

function Editor({
  editingSlug,
  yaml,
  newSlug,
  seriesSlug,
  seriesDescription,
  active,
  validationResult,
  saving,
  validating,
  onYamlChange,
  onSlugChange,
  onSeriesSlugChange,
  onSeriesDescChange,
  onValidate,
  onSave,
  onBack,
}: {
  editingSlug: string | null;
  yaml: string;
  newSlug: string;
  seriesSlug: string;
  seriesDescription: string;
  active: boolean;
  validationResult: { valid: boolean; error?: string; details?: string } | null;
  saving: boolean;
  validating: boolean;
  onYamlChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onSeriesSlugChange: (v: string) => void;
  onSeriesDescChange: (v: string) => void;
  onValidate: () => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"yaml" | "settings">("yaml");

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              padding: "6px 12px",
              background: "rgba(91,191,191,0.1)",
              border: "1px solid rgba(91,191,191,0.2)",
              borderRadius: 4,
              color: "#8aaab8",
              fontSize: 12,
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              letterSpacing: "0.08em",
              color: "#d4f0f0",
              margin: 0,
            }}
          >
            {editingSlug ? `Edit: ${editingSlug}` : "New Post"}
          </h1>
          {editingSlug && (
            <span
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.1em",
                padding: "3px 8px",
                borderRadius: 3,
                background: active ? "rgba(91,191,191,0.12)" : "rgba(203,102,102,0.1)",
                color: active ? "#5bbfbf" : "#cb6666",
                border: `1px solid ${active ? "rgba(91,191,191,0.25)" : "rgba(203,102,102,0.2)"}`,
              }}
            >
              {active ? "ACTIVE" : "INACTIVE"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onValidate}
            disabled={validating}
            style={{
              padding: "9px 18px",
              background: "rgba(91,191,191,0.12)",
              border: "1px solid rgba(91,191,191,0.3)",
              borderRadius: 4,
              color: "#5bbfbf",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 13,
              letterSpacing: "0.1em",
              cursor: "pointer",
              opacity: validating ? 0.5 : 1,
            }}
          >
            {validating ? "VALIDATING..." : "VALIDATE"}
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              padding: "9px 22px",
              background: "#5bbfbf",
              border: "none",
              borderRadius: 4,
              color: "#0d1b24",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14,
              letterSpacing: "0.12em",
              cursor: "pointer",
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? "SAVING..." : editingSlug ? "UPDATE" : "PUBLISH"}
          </button>
        </div>
      </div>

      {/* Validation result */}
      {validationResult && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 4,
            marginBottom: 16,
            background: validationResult.valid ? "#0d2a1a" : "#2a0d0d",
            border: `1px solid ${validationResult.valid ? "rgba(91,191,191,0.3)" : "rgba(203,102,102,0.3)"}`,
            fontSize: 13,
            fontFamily: "monospace",
            color: validationResult.valid ? "#5bbfbf" : "#cb6666",
          }}
        >
          {validationResult.valid ? (
            <span>YAML is valid — all fields parsed successfully.</span>
          ) : (
            <span>
              {validationResult.error}
              {validationResult.details && (
                <span style={{ opacity: 0.7 }}>
                  {" "}
                  — {validationResult.details}
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 16,
          borderBottom: "1px solid rgba(91,191,191,0.12)",
        }}
      >
        {(["yaml", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? "2px solid #5bbfbf"
                  : "2px solid transparent",
              color: activeTab === tab ? "#5bbfbf" : "#4a6a7a",
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {tab === "yaml" ? "YAML Editor" : "Post Settings"}
          </button>
        ))}
      </div>

      {activeTab === "settings" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8aaab8",
                marginBottom: 6,
              }}
            >
              Slug *
            </label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="my-new-post"
              style={{
                width: "100%",
                padding: "9px 14px",
                background: "#0d1b24",
                border: "1px solid rgba(91,191,191,0.18)",
                borderRadius: 4,
                color: "#d4f0f0",
                fontSize: 14,
                fontFamily: "monospace",
                outline: "none",
              }}
            />
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: "#4a6a7a",
                marginTop: 4,
              }}
            >
              Lowercase, numbers, hyphens only
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8aaab8",
                marginBottom: 6,
              }}
            >
              Series Slug
            </label>
            <input
              type="text"
              value={seriesSlug}
              onChange={(e) => onSeriesSlugChange(e.target.value)}
              placeholder="optional-series-name"
              style={{
                width: "100%",
                padding: "9px 14px",
                background: "#0d1b24",
                border: "1px solid rgba(91,191,191,0.18)",
                borderRadius: 4,
                color: "#d4f0f0",
                fontSize: 14,
                fontFamily: "monospace",
                outline: "none",
              }}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8aaab8",
                marginBottom: 6,
              }}
            >
              Series Description
            </label>
            <input
              type="text"
              value={seriesDescription}
              onChange={(e) => onSeriesDescChange(e.target.value)}
              placeholder="Description shown on blog index for this series"
              style={{
                width: "100%",
                padding: "9px 14px",
                background: "#0d1b24",
                border: "1px solid rgba(91,191,191,0.18)",
                borderRadius: 4,
                color: "#d4f0f0",
                fontSize: 14,
                fontFamily: "monospace",
                outline: "none",
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "yaml" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 220px)",
          }}
        >
          <textarea
            value={yaml}
            onChange={(e) => onYamlChange(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              padding: "16px 18px",
              background: "#0a151d",
              border: "1px solid rgba(91,191,191,0.12)",
              borderRadius: 4,
              color: "#d4f0f0",
              fontSize: 13,
              fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
              lineHeight: 1.7,
              resize: "none",
              outline: "none",
              tabSize: 2,
            }}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const value = e.currentTarget.value;
                const newValue =
                  value.substring(0, start) + "  " + value.substring(end);
                onYamlChange(newValue);
                requestAnimationFrame(() => {
                  e.currentTarget.selectionStart = start + 2;
                  e.currentTarget.selectionEnd = start + 2;
                });
              }
            }}
          />
        </div>
      )}
    </>
  );
}

function SeriesManager({
  series,
  onRefresh,
  onEditPost,
}: {
  series: Series[];
  onRefresh: () => void;
  onEditPost: (slug: string) => void;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              letterSpacing: "0.08em",
              color: "#d4f0f0",
              margin: 0,
            }}
          >
            Series
          </h1>
          <div
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "#4a6a7a",
              marginTop: 4,
            }}
          >
            {series.length} series
          </div>
        </div>
        <button
          onClick={onRefresh}
          style={{
            padding: "9px 18px",
            background: "rgba(91,191,191,0.12)",
            border: "1px solid rgba(91,191,191,0.3)",
            borderRadius: 4,
            color: "#5bbfbf",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 13,
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          REFRESH
        </button>
      </div>

      {series.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#4a6a7a",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: "0.12em",
              marginBottom: 8,
            }}
          >
            NO SERIES
          </div>
          <div style={{ fontSize: 13, fontFamily: "monospace" }}>
            Assign a seriesSlug to posts to group them.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {series.map((s) => (
            <div
              key={s.seriesSlug}
              style={{
                background: "#111f2a",
                border: "1px solid rgba(91,191,191,0.1)",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(91,191,191,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 18,
                      letterSpacing: "0.08em",
                      color: "#5bbfbf",
                    }}
                  >
                    {s.seriesSlug}
                  </div>
                  {s.seriesDescription && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#6a8a9a",
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      {s.seriesDescription}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                >
                  <span style={{ color: "#8aaab8" }}>
                    {s.postCount} post{s.postCount !== 1 ? "s" : ""}
                  </span>
                  {s.unparseableCount > 0 && (
                    <span style={{ color: "#cb6666" }}>
                      {s.unparseableCount} unparseable
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: "8px 12px" }}>
                {s.posts.map((p) => (
                  <div
                    key={p.slug}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: 3,
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(91,191,191,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "transparent";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 10,
                          color: "#4a6a7a",
                          width: 20,
                        }}
                      >
                        {String(s.posts.indexOf(p) + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 14, color: "#d4f0f0" }}>
                        {p.BLOG_TITLE}
                      </span>
                    </div>
                    <button
                      onClick={() => onEditPost(p.slug)}
                      style={{
                        padding: "4px 10px",
                        background: "rgba(91,191,191,0.08)",
                        border: "1px solid rgba(91,191,191,0.15)",
                        borderRadius: 3,
                        color: "#5bbfbf",
                        fontSize: 11,
                        fontFamily: "monospace",
                        cursor: "pointer",
                      }}
                    >
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

function Generator({
  input,
  onInputChange,
  onCopy,
  onUseInEditor,
}: {
  input: string;
  onInputChange: (v: string) => void;
  onCopy: () => void;
  onUseInEditor: () => void;
}) {
  const combined = `${SCHEMA_PROMPT}\n\n---\n\nBLOG CONTENT:\n\n${input}`;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              letterSpacing: "0.08em",
              color: "#d4f0f0",
              margin: 0,
            }}
          >
            Generate Prompt
          </h1>
          <div
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "#4a6a7a",
              marginTop: 4,
            }}
          >
            Paste your content → combines with schema prompt → copy to use with any AI
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onUseInEditor}
            disabled={!input.trim()}
            style={{
              padding: "9px 18px",
              background: "rgba(91,191,191,0.12)",
              border: "1px solid rgba(91,191,191,0.3)",
              borderRadius: 4,
              color: "#5bbfbf",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 13,
              letterSpacing: "0.1em",
              cursor: input.trim() ? "pointer" : "default",
              opacity: input.trim() ? 1 : 0.4,
            }}
          >
            OPEN IN EDITOR
          </button>
          <button
            onClick={onCopy}
            disabled={!input.trim()}
            style={{
              padding: "9px 22px",
              background: input.trim() ? "#5bbfbf" : "rgba(91,191,191,0.15)",
              border: "none",
              borderRadius: 4,
              color: input.trim() ? "#0d1b24" : "#8aaab8",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14,
              letterSpacing: "0.12em",
              cursor: input.trim() ? "pointer" : "default",
            }}
          >
            COPY COMBINED
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          height: "calc(100vh - 200px)",
        }}
      >
        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8aaab8",
              marginBottom: 8,
            }}
          >
            Your Content
          </div>
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Paste your blog content here.\n\nThis can be:\n• A rough draft\n• Bullet-point outline\n• Stream-of-consciousness notes\n• A finished article\n\nIt will be combined with the YAML schema prompt on the right.`}
            style={{
              flex: 1,
              padding: "16px 18px",
              background: "#0a151d",
              border: "1px solid rgba(91,191,191,0.12)",
              borderRadius: 4,
              color: "#d4f0f0",
              fontSize: 14,
              fontFamily: "'SN Pro', sans-serif",
              lineHeight: 1.7,
              resize: "none",
              outline: "none",
            }}
          />
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: "#4a6a7a",
              marginTop: 6,
              textAlign: "right",
            }}
          >
            {input.length} chars
          </div>
        </div>

        {/* Combined output */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8aaab8",
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Combined Prompt + Content</span>
            <span style={{ color: "#4a6a7a" }}>
              {combined.length} chars
            </span>
          </div>
          <textarea
            value={combined}
            readOnly
            style={{
              flex: 1,
              padding: "16px 18px",
              background: "#0a151d",
              border: "1px solid rgba(91,191,191,0.12)",
              borderRadius: 4,
              color: "#d4f0f0",
              fontSize: 13,
              fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
              lineHeight: 1.7,
              resize: "none",
              outline: "none",
            }}
          />
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: "#4a6a7a",
              marginTop: 6,
            }}
          >
            Copy this and paste into any AI (ChatGPT, Claude, etc.) to get structured YAML
          </div>
        </div>
      </div>
    </>
  );
}

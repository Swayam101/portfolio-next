"use client";

import { useState, useRef, useCallback } from "react";
import { BLOG_CATEGORIES } from "@/features/blog/types";
import type { ValidationResult } from "../types";
import { S } from "../styles";
import { YamlPreview } from "./YamlPreview";
import { QuickInsertToolbar } from "./QuickInsertToolbar";

interface Props {
  editingSlug: string | null;
  yaml: string;
  yamlHindi: string;
  yamlHinglish: string;
  newSlug: string;
  seriesSlug: string;
  seriesDescription: string;
  active: boolean;
  metaTags: string;
  metaReadTime: string;
  metaDate: string;
  metaCategory: string;
  metaSeoTitle: string;
  metaSeoDescription: string;
  metaOgImage: string;
  validationResult: ValidationResult | null;
  saving: boolean;
  validating: boolean;
  onYamlChange: (v: string) => void;
  onYamlHindiChange: (v: string) => void;
  onYamlHinglishChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onSeriesSlugChange: (v: string) => void;
  onSeriesDescChange: (v: string) => void;
  onMetaTagsChange: (v: string) => void;
  onMetaReadTimeChange: (v: string) => void;
  onMetaDateChange: (v: string) => void;
  onMetaCategoryChange: (v: string) => void;
  onMetaSeoTitleChange: (v: string) => void;
  onMetaSeoDescriptionChange: (v: string) => void;
  onMetaOgImageChange: (v: string) => void;
  onValidate: (yaml: string) => void;
  onSave: () => void;
  onBack: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

export function EditorView({
  editingSlug, yaml, yamlHindi, yamlHinglish, newSlug, seriesSlug, seriesDescription, active,
  metaTags, metaReadTime, metaDate, metaCategory, metaSeoTitle, metaSeoDescription, metaOgImage,
  validationResult, saving, validating,
  onYamlChange, onYamlHindiChange, onYamlHinglishChange, onSlugChange, onSeriesSlugChange, onSeriesDescChange,
  onMetaTagsChange, onMetaReadTimeChange, onMetaDateChange, onMetaCategoryChange,
  onMetaSeoTitleChange, onMetaSeoDescriptionChange, onMetaOgImageChange,
  onValidate, onSave, onBack,
}: Props) {
  const [tab, setTab] = useState<"yaml" | "settings">("yaml");
  const [yamlTab, setYamlTab] = useState<"en" | "hi" | "hinglish">("en");
  const [splitRatio, setSplitRatio] = useState(50);
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentYaml = yamlTab === "hi" ? yamlHindi : yamlTab === "hinglish" ? yamlHinglish : yaml;
  const currentOnChange = yamlTab === "hi" ? onYamlHindiChange : yamlTab === "hinglish" ? onYamlHinglishChange : onYamlChange;

  const handleInsert = useCallback((text: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      currentOnChange(currentYaml + text);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = currentYaml.substring(0, start);
    const after = currentYaml.substring(end);
    const newYaml = before + text + after;
    currentOnChange(newYaml);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + text.length;
      ta.selectionStart = pos;
      ta.selectionEnd = pos;
    });
  }, [currentYaml, currentOnChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const newYaml = val.substring(0, start) + "  " + val.substring(end);
      currentOnChange(newYaml);
      requestAnimationFrame(() => { ta.selectionStart = start + 2; ta.selectionEnd = start + 2; });
    }
  };

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = (e.target as HTMLElement).closest("[data-split]") as HTMLElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const onMove = (me: MouseEvent) => {
      const pct = ((me.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.min(80, Math.max(20, pct)));
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ ...S.btn, padding: "6px 12px", fontSize: 12 }}>← Back</button>
          <h1 style={S.sectionTitle}>{editingSlug ? `Edit: ${editingSlug}` : "New Post"}</h1>
          {editingSlug && (
            <span style={{
              fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 3,
              background: active ? "rgba(91,191,191,0.12)" : "rgba(203,102,102,0.1)",
              color: active ? "#5bbfbf" : "#cb6666",
              border: `1px solid ${active ? "rgba(91,191,191,0.25)" : "rgba(203,102,102,0.2)"}`,
            }}>
              {active ? "ACTIVE" : "INACTIVE"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onValidate(currentYaml)} disabled={validating} style={{ ...S.btn, opacity: validating ? 0.5 : 1 }}>
            {validating ? "VALIDATING..." : "VALIDATE"}
          </button>
          <button onClick={onSave} disabled={saving} style={{ ...S.btnPrimary, opacity: saving ? 0.5 : 1 }}>
            {saving ? "SAVING..." : editingSlug ? "UPDATE" : "PUBLISH"}
          </button>
        </div>
      </div>

      {/* Validation result */}
      {validationResult && (
        <div style={{
          padding: "10px 14px", borderRadius: 4, marginBottom: 12, fontSize: 12, fontFamily: "monospace",
          background: validationResult.valid ? "#0d2a1a" : "#2a0d0d",
          border: `1px solid ${validationResult.valid ? "rgba(91,191,191,0.3)" : "rgba(203,102,102,0.3)"}`,
          color: validationResult.valid ? "#5bbfbf" : "#cb6666",
        }}>
          {validationResult.valid ? "YAML is valid" : (
            <span>{validationResult.error}{validationResult.details && <span style={{ opacity: 0.7 }}> — {validationResult.details}</span>}</span>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 12, borderBottom: "1px solid rgba(91,191,191,0.12)" }}>
        {(["yaml", "settings"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", background: "none", border: "none",
            borderBottom: tab === t ? "2px solid #5bbfbf" : "2px solid transparent",
            color: tab === t ? "#5bbfbf" : "#4a6a7a", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
          }}>
            {t === "yaml" ? "YAML Editor" : "Post Settings"}
          </button>
        ))}
        {tab === "yaml" && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                padding: "4px 10px", background: showPreview ? "rgba(91,191,191,0.15)" : "transparent",
                border: "1px solid rgba(91,191,191,0.2)", borderRadius: 3,
                color: showPreview ? "#5bbfbf" : "#4a6a7a", fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", cursor: "pointer",
              }}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
        )}
      </div>

      {/* Settings tab */}
      {tab === "settings" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <Field label="Slug *">
            <input type="text" value={newSlug} onChange={(e) => onSlugChange(e.target.value)} placeholder="my-new-post" style={S.input} />
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#4a6a7a", marginTop: 4 }}>Lowercase, numbers, hyphens only</div>
          </Field>
          <Field label="Series Slug">
            <input type="text" value={seriesSlug} onChange={(e) => onSeriesSlugChange(e.target.value)} placeholder="optional-series-name" style={S.input} />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Series Description">
              <input type="text" value={seriesDescription} onChange={(e) => onSeriesDescChange(e.target.value)} placeholder="Description shown on blog index for this series" style={S.input} />
            </Field>
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: 12 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5bbfbf", marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid rgba(91,191,191,0.15)" }}>
              Post Metadata
            </div>
          </div>

          <Field label="Category">
            <select value={metaCategory} onChange={(e) => onMetaCategoryChange(e.target.value)} style={{ ...S.input, cursor: "pointer" }}>
              <option value="">No category</option>
              {BLOG_CATEGORIES.map((cat) => (<option key={cat.slug} value={cat.slug}>{cat.label}</option>))}
            </select>
          </Field>
          <Field label="Tags">
            <input type="text" value={metaTags} onChange={(e) => onMetaTagsChange(e.target.value)} placeholder="Dev · Career · Architecture" style={S.input} />
          </Field>
          <Field label="Read Time">
            <input type="text" value={metaReadTime} onChange={(e) => onMetaReadTimeChange(e.target.value)} placeholder="8 min read" style={S.input} />
          </Field>
          <Field label="Date">
            <input type="text" value={metaDate} onChange={(e) => onMetaDateChange(e.target.value)} placeholder="June 2025" style={S.input} />
          </Field>
          <Field label="SEO Title">
            <input type="text" value={metaSeoTitle} onChange={(e) => onMetaSeoTitleChange(e.target.value)} placeholder="< 60 chars for search engines" style={S.input} />
          </Field>
          <Field label="SEO Description">
            <input type="text" value={metaSeoDescription} onChange={(e) => onMetaSeoDescriptionChange(e.target.value)} placeholder="< 160 chars for search snippets" style={S.input} />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="OG Image URL">
              <input type="text" value={metaOgImage} onChange={(e) => onMetaOgImageChange(e.target.value)} placeholder="https://example.com/image.jpg" style={S.input} />
            </Field>
          </div>
        </div>
      )}

      {/* YAML tab — split pane */}
      {tab === "yaml" && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 230px)" }}>
          {/* Quick insert toolbar */}
          <div style={{ padding: "8px 12px", background: "#111f2a", border: "1px solid rgba(91,191,191,0.1)", borderRadius: "4px 4px 0 0", marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <QuickInsertToolbar onInsert={handleInsert} />
            <div style={{ display: "flex", gap: 4 }}>
              {(["en", "hi", "hinglish"] as const).map((l) => (
                <button key={l} onClick={() => setYamlTab(l)} style={{ padding: "4px 8px", background: yamlTab === l ? "rgba(91,191,191,0.2)" : "transparent", color: yamlTab === l ? "#5bbfbf" : "#4a6a7a", border: "1px solid rgba(91,191,191,0.2)", borderRadius: 3, fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", cursor: "pointer" }}>
                  {l === "en" ? "EN" : l === "hi" ? "HI" : "HINGLISH"}
                </button>
              ))}
            </div>
          </div>

          {/* Split pane */}
          <div data-split style={{ display: "flex", flex: 1, border: "1px solid rgba(91,191,191,0.12)", borderTop: "none", borderRadius: "0 0 4px 4px", overflow: "hidden" }}>
            {/* Editor */}
            <div style={{ width: showPreview ? `${splitRatio}%` : "100%", display: "flex", flexDirection: "column", position: "relative" }}>
              <textarea
                ref={textareaRef}
                value={currentYaml}
                onChange={(e) => currentOnChange(e.target.value)}
                spellCheck={false}
                style={{
                  flex: 1, padding: "14px 16px", background: "#0a151d", border: "none",
                  color: "#d4f0f0", fontSize: 13, fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace", lineHeight: 1.7, resize: "none", outline: "none", tabSize: 2,
                }}
                onKeyDown={handleKeyDown}
              />
              {/* Line count */}
              <div style={{ position: "absolute", bottom: 8, right: 12, fontFamily: "monospace", fontSize: 10, color: "#4a6a7a" }}>
                {currentYaml.split("\n").length} lines · {currentYaml.length} chars
              </div>
            </div>

            {/* Drag handle */}
            {showPreview && (
              <div
                onMouseDown={startDrag}
                style={{ width: 5, background: "#111f2a", cursor: "col-resize", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <div style={{ width: 1, height: 24, background: "rgba(91,191,191,0.3)", borderRadius: 1 }} />
              </div>
            )}

            {/* Preview */}
            {showPreview && (
              <div style={{ flex: 1, background: "#f2fafa", overflowY: "auto" }}>
                <YamlPreview yaml={currentYaml} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

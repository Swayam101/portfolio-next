"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { Post, Series, RawPost, View, Toast, ValidationResult, LocalDraft } from "./types";
import { EMPTY_YAML, SCHEMA_PROMPT, TRANSLATION_PROMPT } from "./constants";
import { LoginScreen } from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { Toast as ToastComp } from "./components/Toast";
import { DashboardView } from "./components/DashboardView";
import { EditorView } from "./components/EditorView";
import { SeriesView } from "./components/SeriesView";

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
  const [toast, setToast] = useState<Toast | null>(null);
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);

  // Load drafts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("swayam_blog_drafts");
      if (stored) setDrafts(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load drafts", e);
    }
  }, []);

  // Editor state
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [rawContent, setRawContent] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [yaml, setYaml] = useState(EMPTY_YAML);
  const [yamlHindi, setYamlHindi] = useState("");
  const [yamlHinglish, setYamlHinglish] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [seriesSlug, setSeriesSlug] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [editingActive, setEditingActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [metaTags, setMetaTags] = useState("");
  const [metaReadTime, setMetaReadTime] = useState("");
  const [metaDate, setMetaDate] = useState("");
  const [metaCategory, setMetaCategory] = useState("");
  const [metaSeoTitle, setMetaSeoTitle] = useState("");
  const [metaSeoDescription, setMetaSeoDescription] = useState("");
  const [metaOgImage, setMetaOgImage] = useState("");

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const headers = useMemo(() => ({ "Content-Type": "application/json", "x-api-key": apiKey }), [apiKey]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // Sync active draft to localStorage
  useEffect(() => {
    if (!activeDraftId || !authenticated) return;
    const titleMatch = yaml.match(/^BLOG_TITLE:\s*"?([^"\n]*)"?/);
    const title = titleMatch?.[1] || newSlug || "Untitled Draft";
    
    setDrafts((prev) => {
      const existing = prev.find(d => d.id === activeDraftId);
      const updatedDraft: LocalDraft = {
        id: activeDraftId,
        title,
        rawContent,
        yaml,
        yamlHindi,
        yamlHinglish,
        slug: newSlug,
        seriesSlug,
        seriesDescription,
        active: editingActive,
        tags: metaTags,
        readTime: metaReadTime,
        date: metaDate,
        category: metaCategory,
        seoTitle: metaSeoTitle,
        seoDescription: metaSeoDescription,
        ogImage: metaOgImage,
        updatedAt: Date.now()
      };
      
      const isDifferent = !existing || JSON.stringify(existing) !== JSON.stringify(updatedDraft);
      if (!isDifferent) return prev;

      const newDrafts = existing ? prev.map(d => d.id === activeDraftId ? updatedDraft : d) : [updatedDraft, ...prev];
      localStorage.setItem("swayam_blog_drafts", JSON.stringify(newDrafts));
      return newDrafts;
    });
  }, [
    activeDraftId, authenticated, rawContent, yaml, yamlHindi, yamlHinglish, 
    newSlug, seriesSlug, seriesDescription, editingActive, metaTags, 
    metaReadTime, metaDate, metaCategory, metaSeoTitle, metaSeoDescription, metaOgImage
  ]);

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
      const all: Post[] = [
        ...data.series.flatMap((s: Series) => s.posts),
        ...(data.categories ?? []).flatMap((c: { posts: Post[] }) => c.posts),
        ...data.standalone,
      ];
      setPosts(all);
      setTotal(all.length);
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
    if (authenticated) { fetchPosts(); fetchSeries(); }
  }, [authenticated, fetchPosts, fetchSeries]);

  useEffect(() => {
    if (authenticated) fetchPosts();
  }, [debouncedSearch, filterSeries, authenticated, fetchPosts]);

  const openEditor = async (slug?: string) => {
    if (slug) {
      try {
        const res = await fetch(`/api/blog/raw/${slug}`, { headers });
        if (!res.ok) throw new Error("Failed to fetch post");
        const data: RawPost = await res.json();
        setActiveDraftId(`draft-${slug}`);
        setEditingSlug(slug);
        setRawContent("");
        setYaml(data.yaml);
        setYamlHindi(data.yamlHindi || "");
        setYamlHinglish(data.yamlHinglish || "");
        setNewSlug(slug);
        setSeriesSlug(data.seriesSlug || "");
        setSeriesDescription(data.seriesDescription || "");
        setEditingActive(data.active);
        setMetaTags(data.tags || "");
        setMetaReadTime(data.readTime || "");
        setMetaDate(data.date || "");
        setMetaCategory(data.category || "");
        setMetaSeoTitle(data.seoTitle || "");
        setMetaSeoDescription(data.seoDescription || "");
        setMetaOgImage(data.ogImage || "");
      } catch {
        showToast("Failed to load post", "error");
        return;
      }
    } else {
      setActiveDraftId(`draft-${Date.now()}`);
      setEditingSlug(null);
      setRawContent("");
      setYaml(EMPTY_YAML);
      setYamlHindi("");
      setYamlHinglish("");
      setNewSlug("");
      setSeriesSlug("");
      setSeriesDescription("");
      setEditingActive(true);
      setMetaTags(""); setMetaReadTime(""); setMetaDate("");
      setMetaCategory(""); setMetaSeoTitle(""); setMetaSeoDescription(""); setMetaOgImage("");
    }
    setValidationResult(null);
    setView("editor");
  };

  const openDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    setActiveDraftId(draft.id);
    setEditingSlug(draft.slug || null);
    setRawContent(draft.rawContent || "");
    setYaml(draft.yaml || EMPTY_YAML);
    setYamlHindi(draft.yamlHindi || "");
    setYamlHinglish(draft.yamlHinglish || "");
    setNewSlug(draft.slug || "");
    setSeriesSlug(draft.seriesSlug || "");
    setSeriesDescription(draft.seriesDescription || "");
    setEditingActive(draft.active ?? true);
    setMetaTags(draft.tags || "");
    setMetaReadTime(draft.readTime || "");
    setMetaDate(draft.date || "");
    setMetaCategory(draft.category || "");
    setMetaSeoTitle(draft.seoTitle || "");
    setMetaSeoDescription(draft.seoDescription || "");
    setMetaOgImage(draft.ogImage || "");
    setValidationResult(null);
    setView("editor");
  };

  const deleteDraft = (draftId: string) => {
    setDrafts(prev => {
      const newDrafts = prev.filter(d => d.id !== draftId);
      localStorage.setItem("swayam_blog_drafts", JSON.stringify(newDrafts));
      return newDrafts;
    });
    if (activeDraftId === draftId) {
      setView("dashboard");
    }
  };

  const handleValidate = async (yamlToValidate: string) => {
    setValidating(true);
    setValidationResult(null);
    try {
      const res = await fetch("/api/blog/validate", { method: "POST", headers, body: JSON.stringify({ yaml: yamlToValidate }) });
      const data = await res.json();
      setValidationResult(data);
      if (data.valid) showToast("YAML is valid", "success");
    } catch {
      setValidationResult({ valid: false, error: "Validation request failed" });
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    if (!newSlug.trim()) { showToast("Slug is required", "error"); return; }
    setSaving(true);
    try {
      const body: Record<string, string> = { slug: newSlug.trim(), yaml };
      if (editingSlug) body.originalSlug = editingSlug;
      if (yamlHindi.trim()) body.yamlHindi = yamlHindi.trim();
      if (yamlHinglish.trim()) body.yamlHinglish = yamlHinglish.trim();
      if (seriesSlug.trim()) body.seriesSlug = seriesSlug.trim();
      if (seriesDescription.trim()) body.seriesDescription = seriesDescription.trim();
      if (metaTags) body.tags = metaTags;
      if (metaReadTime) body.readTime = metaReadTime;
      if (metaDate) body.date = metaDate;
      if (metaCategory) body.category = metaCategory;
      if (metaSeoTitle) body.seoTitle = metaSeoTitle;
      if (metaSeoDescription) body.seoDescription = metaSeoDescription;
      if (metaOgImage) body.ogImage = metaOgImage;

      const res = await fetch("/api/blog", { method: "POST", headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to save", "error"); return; }
      showToast(editingSlug ? "Post updated successfully" : "Post created successfully", "success");
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
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "PATCH", headers, body: JSON.stringify({ active: newActive }) });
      if (!res.ok) throw new Error("Failed to toggle");
      showToast(newActive ? "Post activated" : "Post deactivated", "success");
      fetchPosts();
      fetchSeries();
    } catch {
      showToast(`Failed to ${action} post`, "error");
    }
  };

  const handleCopyTranslationPrompt = (lang: string) => {
    const languageMap: Record<string, string> = {
      hi: "Hindi",
      hinglish: "Hinglish",
    };
    const languageName = languageMap[lang] || lang;
    const prompt = TRANSLATION_PROMPT.replace("{LANGUAGE}", languageName);
    const textToCopy = `${prompt}\n\n---\n\nSOURCE YAML:\n\n${yaml}`;
    navigator.clipboard.writeText(textToCopy);
    showToast(`Translation prompt for ${languageName} copied`, "success");
  };

  const handleCopyGeneratePrompt = () => {
    navigator.clipboard.writeText(`${SCHEMA_PROMPT}\n\n---\n\nBLOG CONTENT:\n\n${rawContent}`);
    showToast("Prompt + content copied to clipboard", "success");
  };

  if (!authenticated) {
    return <LoginScreen onLogin={(key) => { setApiKey(key); setAuthenticated(true); }} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b24", color: "#d4f0f0", fontFamily: "'SN Pro', sans-serif", display: "flex" }}>
      {toast && <ToastComp toast={toast} />}
      <Sidebar view={view} onNavigate={(v) => { if (v === "editor" && !editingSlug) openEditor(); else setView(v); }} onLogout={() => setAuthenticated(false)} />

      <main style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>
        {view === "dashboard" && (
          <DashboardView posts={posts} drafts={drafts} total={total} loading={loading} search={search} filterSeries={filterSeries} series={series}
            onSearchChange={setSearch} onSeriesChange={setFilterSeries} onEdit={openEditor} onOpenDraft={openDraft} onDeleteDraft={deleteDraft} onToggleActive={handleToggleActive} onNew={() => openEditor()} />
        )}
        {view === "editor" && (
          <EditorView
            editingSlug={editingSlug} rawContent={rawContent} yaml={yaml} yamlHindi={yamlHindi} yamlHinglish={yamlHinglish} newSlug={newSlug} seriesSlug={seriesSlug} seriesDescription={seriesDescription} active={editingActive}
            metaTags={metaTags} metaReadTime={metaReadTime} metaDate={metaDate} metaCategory={metaCategory} metaSeoTitle={metaSeoTitle} metaSeoDescription={metaSeoDescription} metaOgImage={metaOgImage}
            validationResult={validationResult} saving={saving} validating={validating}
            onRawContentChange={setRawContent} onYamlChange={setYaml} onYamlHindiChange={setYamlHindi} onYamlHinglishChange={setYamlHinglish} onSlugChange={setNewSlug} onSeriesSlugChange={setSeriesSlug} onSeriesDescChange={setSeriesDescription}
            onMetaTagsChange={setMetaTags} onMetaReadTimeChange={setMetaReadTime} onMetaDateChange={setMetaDate} onMetaCategoryChange={setMetaCategory}
            onMetaSeoTitleChange={setMetaSeoTitle} onMetaSeoDescriptionChange={setMetaSeoDescription} onMetaOgImageChange={setMetaOgImage}
            onValidate={handleValidate} onSave={handleSave} onBack={() => setView("dashboard")}
            onCopyTranslationPrompt={handleCopyTranslationPrompt} onCopyGeneratePrompt={handleCopyGeneratePrompt} />
        )}
        {view === "series" && <SeriesView series={series} onRefresh={fetchSeries} onEditPost={openEditor} />}
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

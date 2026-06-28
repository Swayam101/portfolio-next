# Blog Generation Schema & Rules

This document outlines the YAML schema for blog post content and the separate metadata fields stored in MongoDB.

## YAML Content Schema

The YAML string contains only the directly-rendered blog content. Metadata (tags, read time, date, SEO) is stored as separate MongoDB fields — see below.

```yaml
BLOG_TITLE: "The main visible headline of the blog"
KICKER: "Category · Tag (e.g. Deep Dive · Engineering)"
SUBTITLE: "A hook or subtitle displayed beneath the title."
CLOSING_QUOTE: "A powerful quote to end the post"
```

## Structure & Sidebars
A post contains an array of `SIDEBAR_TOC` items and `SECTIONS`.

### Sidebar TOC
```yaml
SIDEBAR_TOC:
  - NUM: "I"
    TITLE: "First Section Name"
  - NUM: "II"
    TITLE: "Second Section Name"
```

### Sections Array
```yaml
SECTIONS:
  - SECTION:
      NUM: "I"
      TITLE: "First Section Name"
      DROP_CAP: true # Only true for the very first section
      CONTENT: |
        First paragraph goes here.
        
        Second paragraph separated by a blank line.
      COMPONENTS: [] # Array of rich components
```

## Supported Components
You can insert these components inside the `COMPONENTS` array of any `SECTION`.

### 1. Image
**IMPORTANT RULE**: When generating images, you must use a placeholder URL in the format `https://example.com/placeholder-image-[N].jpg`. I will replace these placeholder URLs manually later.
```yaml
- type: "IMAGE"
  TITLE: "Description for the caption and alt text"
  DESCRIPTION: "Short sub-caption"
  ASPECT: "wide" # "hero", "wide", or "square"
  PLACEMENT: "after_intro" # "after_intro", "after_first_para", or "end_of_section"
  SRC: "https://example.com/placeholder-image-1.jpg"
```

### 2. Stat Strip
```yaml
- type: "STAT_STRIP"
  STATS:
    - NUM: "73%"
      LABEL: "of outages"
    - NUM: "3am"
      LABEL: "wake up call"
```

### 3. Grid
```yaml
- type: "GRID"
  ITEMS:
    - NUM: "01"
      LABEL: "Category"
      TITLE: "Card Title"
      BODY: "Detailed text for the grid card."
```

### 4. Callout
```yaml
- type: "CALLOUT"
  STYLE: "gold" # "gold" or "red"
  TEXT: "Important notice or summary text."
```

### 5. Pull Quote
```yaml
- type: "PULL_QUOTE"
  TEXT: "A strong quote extracted from the text."
```

---

## Post Metadata (stored in MongoDB, not in YAML)

These fields are stored as separate document fields alongside the YAML string:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tags` | string | no | Tags separated by " · " (e.g. "Dev · Career · Architecture") |
| `readTime` | string | no | Read time (e.g. "8 min read") |
| `date` | string | no | Publication date (e.g. "June 2025") |
| `category` | string | no | One of: `people`, `anatomy`, `footnotes`, `deep-currents` |
| `seoTitle` | string | no | SEO title (< 60 chars) |
| `seoDescription` | string | no | SEO description (< 160 chars) |
| `ogImage` | string | no | URL for social media preview card |

These are set via the admin panel's "Post Settings" tab or through the API.

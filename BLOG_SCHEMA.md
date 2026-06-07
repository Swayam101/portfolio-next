# Blog Generation Schema & Rules

This document outlines the strict YAML schema required for rendering blog posts dynamically. It must be strictly followed when generating new posts.

## Core Metadata
```yaml
BLOG_TITLE: "The main visible headline of the blog"
KICKER: "Category · Tag (e.g. Deep Dive · Engineering)"
SUBTITLE: "A hook or subtitle displayed beneath the title."
READ_TIME: "X min read"
TAGS: "Tag1 · Tag2 · Tag3"
DATE: "Month Year (e.g. June 2025)"
CLOSING_QUOTE: "A powerful quote to end the post"
SEO_TITLE: "Optional: The title used for search engines (< 60 chars)"
SEO_DESCRIPTION: "Optional: Search engine snippet (< 160 chars)"
OG_IMAGE: "Optional: URL for social media preview card"
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

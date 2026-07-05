# Blog Generation Schema & Rules

This document is the source of truth for blog post YAML structure. The admin panel's "Generate Prompt" feature combines this schema with your raw content to produce correctly-formatted YAML.

## Top-Level Fields

```yaml
BLOG_TITLE: "The main visible headline of the blog"      # REQUIRED
KICKER: "Deep Dive · Engineering"                         # REQUIRED — format: "Category · Tag"
SUBTITLE: "A hook or subtitle displayed beneath the title." # REQUIRED
CLOSING_QUOTE: "A powerful quote to end the post"        # REQUIRED
SIDEBAR_TOC:                                               # REQUIRED — must mirror SECTIONS titles
  - NUM: "I"
    TITLE: "First Section Name"
  - NUM: "II"
    TITLE: "Second Section Name"
SECTIONS:                                                  # REQUIRED — array of section objects
  - SECTION:
      ...
```

## Section Structure

Each section is an object inside the `SECTIONS` array:

```yaml
- SECTION:
    NUM: "I"              # Roman numeral — I, II, III, IV, V, ...
    TITLE: "Section Name" # Must match corresponding SIDEBAR_TOC entry exactly
    DROP_CAP: true        # true ONLY on the very first section; false on all others
    CONTENT: |
      First paragraph text goes here.

      Second paragraph starts after a blank line.

      Third paragraph continues.
    COMPONENTS: []        # Array of rich components (can be empty)
```

## Supported Components

Insert these inside the `COMPONENTS` array of any section. Always use the **flat format** with `type:` as the first field.

### 1. Image

```yaml
- type: "IMAGE"
  TITLE: "Caption text shown below the image"    # REQUIRED — this is the visible caption
  DESCRIPTION: "Alt text and sub-caption"         # REQUIRED
  ASPECT: "wide"                                  # REQUIRED — "hero" | "wide" | "square"
  PLACEMENT: "after_intro"                        # REQUIRED — "after_intro" | "after_first_para" | "end_of_section"
  SRC: "https://example.com/placeholder-image-1.jpg"  # REQUIRED — placeholder URL, sequential numbers
```

**Field reference:**
| Field | Values | Purpose |
|-------|--------|---------|
| `TITLE` | any string | Caption shown below the image on the blog |
| `DESCRIPTION` | any string | Alt text for accessibility, sub-caption |
| `ASPECT` | `hero`, `wide`, `square` | Controls image aspect ratio |
| `PLACEMENT` | `after_intro`, `after_first_para`, `end_of_section` | Where the image renders relative to the section text |
| `SRC` | URL string | Image URL — use placeholder format for AI-generated posts |

**Placement meanings:**
- `after_intro` — image appears before any text in the section
- `after_first_para` — image appears after the first paragraph
- `end_of_section` — image appears after all text and other components

### 2. Stat Strip

Shows a row of large numbers with short labels. Good for key statistics.

```yaml
- type: "STAT_STRIP"
  STATS:
    - NUM: "73%"
      LABEL: "of outages happen at night"
    - NUM: "3am"
      LABEL: "most common wake-up call"
    - NUM: "60"
      LABEL: "Sumerian base, still in time today"
```

**Field reference:**
| Field | Purpose |
|-------|---------|
| `NUM` | The large number/percentage displayed prominently |
| `LABEL` | Small descriptor text below the number |

Each stat needs both `NUM` and `LABEL`. Generate 2–4 stats per strip.

### 3. Grid

Shows a row of cards for comparison or categorized information.

```yaml
- type: "GRID"
  ITEMS:
    - NUM: "01"
      LABEL: "India"
      TITLE: "Place Value & Zero"
      BODY: "Ten digits whose meaning shifts with position, plus zero as a true number."
    - NUM: "02"
      LABEL: "Egypt"
      TITLE: "Symbolic Repetition"
      BODY: "A unique symbol per power of ten, repeated to build larger numbers."
```

**Field reference:**
| Field | Purpose |
|-------|---------|
| `NUM` | Sequence number ("01", "02", ...) |
| `LABEL` | Category or origin label above the title |
| `TITLE` | Card heading |
| `BODY` | Card body text |

Each item needs all four fields. Generate 2–4 items per grid.

### 4. Callout

Highlighted box for key takeaways or important statements.

```yaml
- type: "CALLOUT"
  STYLE: "gold"       # "gold" for emphasis, "red" for warnings/contrasts
  TEXT: "Your callout text goes here."
```

### 5. Pull Quote

Large styled quote block, good for extracting a powerful line from the text.

```yaml
- type: "PULL_QUOTE"
  TEXT: "A strong quote extracted from the article text."
```

---

## Post Metadata (stored in MongoDB, not in YAML)

These fields are set via the admin panel's "Post Settings" tab or through the API. They are NOT part of the YAML content.

| Field | Type | Description |
|-------|------|-------------|
| `tags` | string | Tags separated by " · " (e.g. "Dev · Career · Architecture") |
| `readTime` | string | Read time (e.g. "8 min read") |
| `date` | string | Publication date (e.g. "June 2025") |
| `category` | string | One of: `people`, `anatomy`, `footnotes`, `deep-currents` |
| `seoTitle` | string | SEO title (< 60 chars) |
| `seoDescription` | string | SEO description (< 160 chars) |
| `ogImage` | string | URL for social media preview card |

---

## Common Mistakes to Avoid

1. **Wrong field names** — Do not use `CAPTION` (use `TITLE`), `VALUE` (use `NUM`), `NOTE` (use `LABEL`), `HEADING` (use `TITLE`), `CONTENT` on components (use `BODY` on GRID, `TEXT` on CALLOUT/PULL_QUOTE).

2. **Nested format** — Always use flat format: `- type: "IMAGE"` not `- IMAGE: { TITLE: "..." }`.

3. **Missing required fields** — IMAGE needs TITLE, DESCRIPTION, ASPECT, PLACEMENT, and SRC. STAT_STRIP needs STATS array with NUM+LABEL pairs.

4. **Mismatched SIDEBAR_TOC** — Every SIDEBAR_TOC entry must have the exact same NUM and TITLE as the corresponding SECTION.

5. **DROP_CAP on non-first sections** — Only the very first section should have `DROP_CAP: true`.

6. **Empty COMPONENTS** — You can use `COMPONENTS: []` but never omit the COMPONENTS field entirely from a SECTION.

# Blog Admin API Documentation

Base URL: `https://www.swayam.space/api/blog`

Authentication: All endpoints require the `x-api-key` header.

**All endpoints are `force-dynamic`** — responses are never cached. Every request hits MongoDB directly.

---

## Endpoints

### `GET /api/blog` — List All Posts

Returns blog posts as parsed JSON, grouped into series and standalone posts.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Filter by title, tags, or subtitle (case-insensitive). Matched against already-parsed posts. |
| `series` | string | — | Filter by series slug |
| `all` | boolean | `false` | If `true`, returns both active and inactive posts (for admin panel). Default only returns active posts. |
| `page` | number | `1` | Page number (min 1) |
| `limit` | number | `20` | Posts per page (1–50) |

**Response `200`:**

```json
{
  "total": 12,
  "page": 1,
  "limit": 20,
  "series": [
    {
      "seriesSlug": "distributed-systems",
      "seriesDescription": "A deep dive into distributed systems",
      "posts": [
        {
          "BLOG_TITLE": "Why Most Developers Never Get Good at System Design",
          "KICKER": "Deep Dive · Engineering",
          "SUBTITLE": "Everyone learns algorithms...",
          "READ_TIME": "8 min read",
          "TAGS": "Dev · Career · Architecture",
          "DATE": "June 2025",
          "CLOSING_QUOTE": "...",
          "SEO_TITLE": "System Design for Developers",
          "SEO_DESCRIPTION": "Why most developers struggle...",
          "OG_IMAGE": "https://...",
          "SECTIONS": [],
          "SIDEBAR_TOC": [],
          "active": true,
          "slug": "system-design",
          "seriesSlug": "distributed-systems",
          "seriesDescription": "A deep dive into distributed systems"
        }
      ]
    }
  ],
  "standalone": [
    {
      "BLOG_TITLE": "...",
      "slug": "...",
      "SECTIONS": [],
      "SIDEBAR_TOC": []
    }
  ]
}
```

**Note:** `total` is the count of posts matching your filters (after `search` and `series` filtering), not the total posts in the database. Posts that fail YAML parsing are silently excluded.

**Response `401`:** `{ "error": "Unauthorized" }`
**Response `503`:** `{ "error": "Blog API is not configured" }`
**Response `500`:** `{ "error": "Internal Server Error" }`

---

### `GET /api/blog/[slug]` — Get Single Post

Returns the full parsed blog post with all sections and components.

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | The post's URL slug |

**Response `200`:**

```json
{
  "slug": "system-design",
  "seriesSlug": "distributed-systems",
  "seriesDescription": "A deep dive into distributed systems",
  "BLOG_TITLE": "Why Most Developers Never Get Good at System Design",
  "KICKER": "Deep Dive · Engineering",
  "SUBTITLE": "Everyone learns algorithms...",
  "READ_TIME": "8 min read",
  "TAGS": "Dev · Career · Architecture",
  "DATE": "June 2025",
  "CLOSING_QUOTE": "The gap between...",
  "SEO_TITLE": "System Design for Developers",
  "SEO_DESCRIPTION": "Why most developers struggle with system design...",
  "OG_IMAGE": "https://...",
  "SIDEBAR_TOC": [
    { "NUM": "I", "TITLE": "The Hidden Curriculum" },
    { "NUM": "II", "TITLE": "What Scale Actually Means" }
  ],
  "SECTIONS": [
    {
      "SECTION": {
        "NUM": "I",
        "TITLE": "The Hidden Curriculum",
        "DROP_CAP": true,
        "CONTENT": "Nobody teaches you system design...",
        "COMPONENTS": [
          {
            "type": "CALLOUT",
            "STYLE": "gold",
            "TEXT": "System design isn't a senior-developer skill."
          }
        ]
      }
    }
  ]
}
```

**Response `404`:** `{ "error": "Post not found" }`

**Response `422` — Corrupt YAML in DB:**

```json
{
  "error": "Failed to parse stored YAML",
  "details": "Cannot read properties of undefined (reading 'SECTIONS')",
  "slug": "system-design"
}
```

**Response `401`:** `{ "error": "Unauthorized" }`
**Response `503`:** `{ "error": "Blog API is not configured" }`
**Response `500`:** `{ "error": "Internal Server Error" }`

---

### `GET /api/blog/raw/[slug]` — Get Raw YAML

Returns the raw YAML string and metadata for editing in a YAML editor.

**Response `200`:**

```json
{
  "slug": "system-design",
  "yaml": "BLOG_TITLE: \"Why Most...\"\nKICKER: \"Deep Dive...\"\n...",
  "seriesSlug": "distributed-systems",
  "seriesDescription": "A deep dive into distributed systems",
  "active": true,
  "createdAt": "2025-06-01T12:00:00.000Z",
  "updatedAt": "2025-06-15T08:30:00.000Z"
}
```

When `seriesSlug` or `seriesDescription` are not set, they return as `undefined` (omitted from JSON), not `null`.

**Response `404`:** `{ "error": "Post not found" }`
**Response `401`:** `{ "error": "Unauthorized" }`
**Response `503`:** `{ "error": "Blog API is not configured" }`
**Response `500`:** `{ "error": "Internal Server Error" }`

---

### `POST /api/blog` — Create or Update Post

Upserts a blog post. The `slug` is the identity field — it cannot be changed after creation. To rename a slug, delete the old post and create a new one.

**Request Body:**

```json
{
  "slug": "system-design",
  "yaml": "BLOG_TITLE: \"Why Most...\"\nKICKER: \"Deep Dive · Engineering\"\n...",
  "seriesSlug": "distributed-systems",
  "seriesDescription": "A deep dive into distributed systems"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | yes | URL-friendly identifier. **Must be lowercase alphanumeric + hyphens only** (e.g. `my-new-post`). Cannot be changed after creation. |
| `yaml` | string | yes | Full blog post content in YAML format. Must pass schema validation. See `BLOG_SCHEMA.md` for the schema. Supports both flat and nested component formats. |
| `seriesSlug` | string | no | Groups this post into a series. All posts with the same `seriesSlug` appear together on the blog index. |
| `seriesDescription` | string | no | Description shown on the blog index for the series group. |

**Slug validation rules:**
- Lowercase letters, numbers, and hyphens only
- Must match pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Examples: `my-post`, `system-design-101`, `react-hooks`
- Invalid: `My Post`, `my_post`, `my.post`, `my post`

**Series behavior:**
- When a post's `seriesSlug` is changed, the old series is checked. If no other posts reference the old series, orphaned series metadata is cleaned up.
- When a post is deleted and it was the last in a series, the series metadata is removed from all remaining documents.

**Response `200`:**

```json
{
  "message": "Blog post saved successfully",
  "slug": "system-design"
}
```

**Response `400` — Missing fields:**

```json
{ "error": "Missing or invalid 'slug' field" }
```

**Response `400` — Invalid slug:**

```json
{
  "error": "Invalid slug format. Use lowercase letters, numbers, and hyphens only (e.g. 'my-new-post')"
}
```

**Response `400` — Invalid YAML:**

```json
{
  "error": "Invalid YAML format",
  "details": "Cannot read properties of undefined (reading 'SECTIONS')"
}
```

**Response `401`:** `{ "error": "Unauthorized" }`
**Response `503`:** `{ "error": "Blog API is not configured" }`
**Response `500`:** `{ "error": "Internal Server Error" }`

---

### `POST /api/blog/validate` — Validate YAML

Validates a YAML string against the blog schema without saving. Returns the full parsed post on success. Useful for draft validation before publish.

**Request Body:**

```json
{
  "yaml": "BLOG_TITLE: \"Why Most...\"\nKICKER: \"Deep Dive · Engineering\"\n..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `yaml` | string | yes | YAML string to validate |

**Response `200`:**

```json
{
  "valid": true,
  "parsed": {
    "BLOG_TITLE": "Why Most Developers Never Get Good at System Design",
    "KICKER": "Deep Dive · Engineering",
    "SUBTITLE": "Everyone learns algorithms...",
    "READ_TIME": "8 min read",
    "TAGS": "Dev · Career · Architecture",
    "DATE": "June 2025",
    "CLOSING_QUOTE": "The gap between...",
    "SEO_TITLE": "System Design for Developers",
    "SEO_DESCRIPTION": "Why most developers struggle...",
    "OG_IMAGE": null,
    "SECTIONS": [
      {
        "SECTION": {
          "NUM": "I",
          "TITLE": "The Hidden Curriculum",
          "DROP_CAP": true,
          "CONTENT": "Nobody teaches you system design...",
          "COMPONENTS": []
        }
      }
    ],
    "SIDEBAR_TOC": [
      { "NUM": "I", "TITLE": "The Hidden Curriculum" }
    ]
  }
}
```

**Response `400` — Invalid YAML:**

```json
{
  "valid": false,
  "error": "Invalid YAML format",
  "details": "Cannot read properties of undefined (reading 'SECTIONS')"
}
```

**Response `400` — Missing yaml field:**

```json
{
  "valid": false,
  "error": "Missing or invalid 'yaml' field"
}
```

**Response `401`:** `{ "error": "Unauthorized" }`
**Response `503`:** `{ "error": "Blog API is not configured" }`

---

### `PATCH /api/blog/[slug]` — Toggle Active Status

Activates or deactivates a blog post. Inactive posts are hidden from the public blog but remain in the database.

**Request Body:**

```json
{
  "active": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `active` | boolean | yes | `true` to activate, `false` to deactivate |

**Response `200`:**

```json
{
  "message": "Post deactivated",
  "slug": "system-design",
  "active": false
}
```

**Response `400`:** `{ "error": "Missing or invalid 'active' field (must be boolean)" }`
**Response `404`:** `{ "error": "Post not found" }`
**Response `401`:** `{ "error": "Unauthorized" }`
**Response `503`:** `{ "error": "Blog API is not configured" }`
**Response `500`:** `{ "error": "Internal Server Error" }`

---

### `GET /api/blog/series` — List All Series

Returns all unique series with their post counts, descriptions, and member posts sorted by creation date (oldest first = reading order).

**Response `200`:**

```json
{
  "series": [
    {
      "seriesSlug": "distributed-systems",
      "seriesDescription": "A deep dive into distributed systems",
      "postCount": 3,
      "unparseableCount": 0,
      "posts": [
        { "slug": "system-design", "BLOG_TITLE": "Why Most..." },
        { "slug": "cap-theorem", "BLOG_TITLE": "CAP Theorem..." },
        { "slug": "event-sourcing", "BLOG_TITLE": "Event Sourcing..." }
      ]
    }
  ]
}
```

**Note:** `unparseableCount` indicates posts in this series whose YAML failed to parse and are not included in `posts`. If this is > 0, the admin panel should surface a warning.

**Response `401`:** `{ "error": "Unauthorized" }`
**Response `503`:** `{ "error": "Blog API is not configured" }`
**Response `500`:** `{ "error": "Internal Server Error" }`

---

## Authentication

All endpoints require the `x-api-key` header:

```
x-api-key: your_secret_api_key_here
```

The API key is set via the `BLOG_API_KEY` environment variable. Requests without a valid key return `401 Unauthorized`. If the environment variable is not set, requests return `503 Blog API is not configured`.

---

## Error Codes

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `400` | Bad request — missing fields, invalid slug, or invalid YAML |
| `401` | Unauthorized — invalid or missing API key |
| `404` | Resource not found |
| `422` | Stored data cannot be parsed (corrupt YAML in DB) |
| `500` | Internal server error |
| `503` | Blog API not configured (missing `BLOG_API_KEY` env var) |

---

## YAML Post Schema

Full schema is defined in `BLOG_SCHEMA.md`. Required fields:

```yaml
BLOG_TITLE: "string — required"
KICKER: "string — required"
SUBTITLE: "string — required"
READ_TIME: "string — required, e.g. '8 min read'"
TAGS: "string — required, e.g. 'Dev · Career · Architecture'"
CLOSING_QUOTE: "string — required"
DATE: "string — optional, e.g. 'June 2025'"
SEO_TITLE: "string — optional, < 60 chars"
SEO_DESCRIPTION: "string — optional, < 160 chars"
OG_IMAGE: "string — optional, URL"
SIDEBAR_TOC:
  - NUM: "Roman numeral — required"
    TITLE: "string — required"
SECTIONS:
  - SECTION:
      NUM: "Roman numeral — required"
      TITLE: "string — required"
      DROP_CAP: "boolean — true only on first section"
      CONTENT: "string — multi-paragraph, blank-line separated"
      COMPONENTS: "array — optional, see component types below"
```

### Component Types

**Flat format (recommended):**

```yaml
COMPONENTS:
  - type: "IMAGE"
    TITLE: "Caption text"
    DESCRIPTION: "Sub-caption"
    ASPECT: "wide"
    PLACEMENT: "after_intro"
    SRC: "https://..."
```

**Nested format (also supported):**

```yaml
COMPONENTS:
  - IMAGE:
      TITLE: "Caption text"
      DESCRIPTION: "Sub-caption"
      ASPECT: "wide"
      PLACEMENT: "after_intro"
      SRC: "https://..."
```

Both formats are accepted. The parser normalises them internally.

| type | Required fields | Optional fields |
|------|----------------|-----------------|
| `IMAGE` | `TITLE`, `DESCRIPTION`, `ASPECT` (hero\|wide\|square), `PLACEMENT` (after_intro\|after_first_para\|end_of_section) | `SRC` (URL) |
| `STAT_STRIP` | `STATS` (array of `{ NUM, LABEL }`) | — |
| `GRID` | `ITEMS` (array of `{ NUM, LABEL, TITLE, BODY }`) | — |
| `CALLOUT` | `STYLE` (gold\|red), `TEXT` | — |
| `PULL_QUOTE` | `TEXT` | — |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `BLOG_API_KEY` | yes | API key for admin endpoints |

---

## Examples

### Create a Post

```bash
curl -X POST https://www.swayam.space/api/blog \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "slug": "my-new-post",
    "yaml": "BLOG_TITLE: \"My New Post\"\nKICKER: \"Tech · Writing\"\nSUBTITLE: \"A short subtitle.\"\nREAD_TIME: \"5 min read\"\nTAGS: \"Tech · Writing\"\nDATE: \"June 2025\"\nCLOSING_QUOTE: \"The end.\"\nSIDEBAR_TOC:\n  - NUM: \"I\"\n    TITLE: \"Introduction\"\nSECTIONS:\n  - SECTION:\n      NUM: \"I\"\n      TITLE: \"Introduction\"\n      DROP_CAP: true\n      CONTENT: |\n        First paragraph.\n\n        Second paragraph.\n      COMPONENTS: []"
  }'
```

### Create a Post in a Series

```bash
curl -X POST https://www.swayam.space/api/blog \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "slug": "distributed-101",
    "yaml": "BLOG_TITLE: \"Intro to Distributed Systems\"\nKICKER: \"Deep Dive · Engineering\"\nSUBTITLE: \"Part 1.\"\nREAD_TIME: \"10 min read\"\nTAGS: \"Distributed · Architecture\"\nDATE: \"June 2025\"\nCLOSING_QUOTE: \"...\"\nSIDEBAR_TOC: []\nSECTIONS:\n  - SECTION:\n      NUM: \"I\"\n      TITLE: \"Introduction\"\n      DROP_CAP: true\n      CONTENT: \"Hello world.\"\n      COMPONENTS: []",
    "seriesSlug": "distributed-systems",
    "seriesDescription": "A deep dive into distributed systems"
  }'
```

### Validate Before Publishing

```bash
curl -X POST https://www.swayam.space/api/blog/validate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{ "yaml": "BLOG_TITLE: \"Test Post\"\nKICKER: \"Test\"\nSUBTITLE: \"...\"\nREAD_TIME: \"1 min read\"\nTAGS: \"Test\"\nCLOSING_QUOTE: \"...\"\nSIDEBAR_TOC: []\nSECTIONS: []" }'
```

### Deactivate a Post

```bash
curl -X PATCH https://www.swayam.space/api/blog/my-new-post \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{ "active": false }'
```

### Reactivate a Post

```bash
curl -X PATCH https://www.swayam.space/api/blog/my-new-post \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{ "active": true }'
```

### Get All Posts

```bash
curl https://www.swayam.space/api/blog \
  -H "x-api-key: your_api_key"
```

### Get Posts with Search

```bash
curl "https://www.swayam.space/api/blog?search=system+design" \
  -H "x-api-key: your_api_key"
```

### Get Posts in a Series

```bash
curl "https://www.swayam.space/api/blog?series=distributed-systems" \
  -H "x-api-key: your_api_key"
```

### Get Raw YAML for Editing

```bash
curl https://www.swayam.space/api/blog/raw/system-design \
  -H "x-api-key: your_api_key"
```

### List All Series

```bash
curl https://www.swayam.space/api/blog/series \
  -H "x-api-key: your_api_key"
```

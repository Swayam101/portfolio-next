# Analytics Events Documentation

This document outlines all analytics events tracked in the portfolio website using both Google Analytics 4 (GA4) and Mixpanel.

## Overview

The portfolio tracks user interactions across both **Google Analytics 4** and **Mixpanel** for comprehensive analytics coverage. All tracking is implemented in a dual-tracking pattern where each user action triggers events in both platforms.

## Event Tracking Summary

### 1. View Item (Project & Blog Views)

**When Triggered:** When a user views a project detail page or blog post

**GA4 Event:**
- Event Name: `view_item`
- Properties:
  - `item_id`: Slug of the project/blog post
  - `item_name`: Title of the project/blog post
  - `item_category`: "project" or "blog_post"
  - `item_list_name`: Series slug (for blog posts only)

**Mixpanel Event:**
- Event Name: `View Item`
- Properties:
  - `item_id`: Slug of the project/blog post
  - `item_name`: Title of the project/blog post
  - `item_category`: "project" or "blog_post"
  - `type`: "project" or "blog_post"
  - `item_list_name`: Series slug (for blog posts only)

**Implementation:**
- Files: `src/lib/analytics.ts` (trackViewItem function)
- Components: `ProjectPageTracker.tsx`, `BlogPageTracker.tsx`
- Hook: `useTrackViewItem` in `src/hooks/useAnalytics.ts`

---

### 2. Generate Lead (Form Submissions)

**When Triggered:** When a user submits the contact form

**GA4 Event:**
- Event Name: `generate_lead`
- Properties:
  - `form_id`: "contact_form"
  - `form_name`: "Portfolio Contact"

**Mixpanel Event:**
- Event Name: `Generate Lead`
- Properties:
  - `source`: "form"
  - `form_id`: "contact_form"
  - `form_name`: "Portfolio Contact"

**Implementation:**
- Files: `src/sections/ContactFormSection.tsx`
- Function: Form submission handler in ContactFormSection component

---

### 3. Generate Lead (CTA Button Clicks)

**When Triggered:** When a user clicks the "Hit Me Up" CTA button in the hero section

**GA4 Event:**
- Event Name: `generate_lead`
- Properties:
  - `cta_text`: "Hit Me Up"
  - `cta_location`: "hero_section"

**Mixpanel Event:**
- Event Name: `Generate Lead`
- Properties:
  - `source`: "cta"
  - `cta_text`: "Hit Me Up"
  - `cta_location`: "hero_section"

**Implementation:**
- Files: `src/sections/CTASection.tsx`
- Function: onClick handler for CTA link

---

### 4. Click External Link (Project Links)

**When Triggered:** When a user clicks "View Live" or "View Repo" on project pages

**GA4 Event:**
- Event Name: `select_content`
- Properties:
  - `content_type`: "external_link"
  - `item_id`: "live_demo" or "repo"
  - `destination_url`: The URL being clicked

**Mixpanel Event:**
- Event Name: `Click External Link`
- Properties:
  - `link_type`: "live_demo" or "repo"
  - `destination`: The URL being clicked

**Implementation:**
- Component: `src/components/analytics/TrackedExternalLink.tsx`
- Usage: Project detail pages (`src/app/projects/[slug]/page.tsx`)

---

### 5. Click External Link (Social Media Links)

**When Triggered:** When a user clicks social media icons in the footer

**GA4 Event:**
- Event Name: `select_content`
- Properties:
  - `content_type`: "external_link"
  - `item_id`: Social platform name (lowercase) - "github", "linkedin", "x", "telegram", "email"
  - `destination_url`: The social media URL

**Mixpanel Event:**
- Event Name: `Click External Link`
- Properties:
  - `link_type`: Social platform name (lowercase)
  - `destination`: The social media URL

**Implementation:**
- Files: `src/sections/FooterSection.tsx`
- Component: `SocialBtn` component with onClick handler

---

## Implementation Architecture

### Core Files

1. **`src/lib/mixpanel.ts`**
   - Initializes Mixpanel with token and configuration
   - Provides `trackMixpanel()` helper function
   - Handles error logging and safe initialization

2. **`src/lib/analytics.ts`**
   - Unified analytics tracking functions
   - Sends events to both GA4 and Mixpanel
   - Functions: `trackViewItem()`, `trackLead()`, `trackExternalLink()`

3. **`src/hooks/useAnalytics.ts`**
   - React hooks for component-level tracking
   - `useTrackViewItem()`: For page view tracking
   - `useTrackExternalLink()`: For link click tracking
   - `useTrackLead()`: For lead generation tracking

### Configuration

**Mixpanel:**
- Token: `c7399c49749641e74790c433edda881f`
- Autocapture: Enabled
- Session Recording: 100% of sessions
- Debug Mode: Enabled in development only

**Google Analytics:**
- Tracking ID: `G-R0LTTKNQ1C`
- Loaded via Google Tag Manager script

### Initialization

Both analytics platforms are initialized in `src/app/layout.tsx`:
- GA4: Script tag with GTM
- Mixpanel: Script tag with loader snippet + initialization call

## Event Mapping Reference

| User Action | GA4 Event | Mixpanel Event | Key Properties |
|-------------|-----------|----------------|----------------|
| View Project | `view_item` | `View Item` | item_id, item_name, type: "project" |
| View Blog Post | `view_item` | `View Item` | item_id, item_name, type: "blog_post" |
| Submit Contact Form | `generate_lead` | `Generate Lead` | source: "form", form_id |
| Click CTA Button | `generate_lead` | `Generate Lead` | source: "cta", cta_text, cta_location |
| Click Project Link | `select_content` | `Click External Link` | link_type, destination |
| Click Social Link | `select_content` | `Click External Link` | link_type, destination |

## Testing Events

To test if events are firing correctly:

### Google Analytics
1. Open Google Analytics Real-Time report
2. Trigger the action on the website
3. Check if the event appears in the Real-Time events

### Mixpanel
1. Open Mixpanel dashboard
2. Go to "Events" section
3. Trigger the action on the website
4. Check if the event appears with correct properties

## Future Enhancements

Potential events to add:
- Blog series navigation
- Time on page / scroll depth
- Search interactions (if search is added)
- Portfolio item filtering
- Download resume clicks
- Video/media interactions

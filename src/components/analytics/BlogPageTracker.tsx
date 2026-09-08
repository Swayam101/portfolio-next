"use client";

import { useTrackViewItem } from "@/hooks/useAnalytics";

interface BlogPageTrackerProps {
  slug: string;
  title: string;
  seriesSlug?: string;
}

export default function BlogPageTracker({ slug, title, seriesSlug }: BlogPageTrackerProps) {
  useTrackViewItem(slug, title, 'blog_post', seriesSlug);
  return null;
}
"use client";

import { useTrackViewItem } from "@/hooks/useAnalytics";

interface ProjectPageTrackerProps {
  slug: string;
  title: string;
}

export default function ProjectPageTracker({ slug, title }: ProjectPageTrackerProps) {
  useTrackViewItem(slug, title, 'project');
  return null;
}
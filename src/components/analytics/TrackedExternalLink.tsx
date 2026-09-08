"use client";

import React from "react";
import { trackMixpanel } from "@/lib/mixpanel";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  itemId: string;
}

export default function TrackedExternalLink({
  href,
  children,
  className,
  style,
  itemId,
}: Props) {
  const handleClick = () => {
    // GA4
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "select_content", {
        content_type: "external_link",
        item_id: itemId,
        destination_url: href,
      });
    }

    // Mixpanel
    trackMixpanel("Click External Link", {
      link_type: itemId,
      destination: href,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

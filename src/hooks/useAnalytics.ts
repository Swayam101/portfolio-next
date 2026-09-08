import { useEffect } from 'react';
import { trackViewItem, trackLead, trackExternalLink } from '@/lib/analytics';

// Hook to track item views (projects and blog posts)
export const useTrackViewItem = (
  itemId: string,
  itemName: string,
  itemCategory: 'project' | 'blog_post',
  item_list_name?: string
) => {
  useEffect(() => {
    if (itemId && itemName) {
      trackViewItem(itemId, itemName, itemCategory, item_list_name);
    }
  }, [itemId, itemName, itemCategory, item_list_name]);
};

// Hook to track external link clicks
export const useTrackExternalLink = () => {
  const handleClick = (linkType: string, destinationUrl: string) => {
    trackExternalLink(linkType, destinationUrl);
  };

  return handleClick;
};

// Hook to track lead generation
export const useTrackLead = () => {
  const trackFormSubmit = (formId: string) => {
    trackLead(formId);
  };

  const trackCTAClick = (ctaText: string, ctaLocation: string) => {
    trackLead(undefined, ctaText, ctaLocation);
  };

  return { trackFormSubmit, trackCTAClick };
};
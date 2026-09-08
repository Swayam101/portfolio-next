// Dual Analytics Tracking Utility (GA4 + Mixpanel)
// Minimal setup for portfolio website

import { trackMixpanel } from './mixpanel';

// Safe gtag call that won't break if GA isn't loaded
const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args);
  }
};

// Track item view (projects and blog posts)
export const trackViewItem = (itemId: string, itemName: string, itemCategory: 'project' | 'blog_post', item_list_name?: string) => {
  const properties = {
    item_id: itemId,
    item_name: itemName,
    item_category: itemCategory,
    item_list_name: item_list_name,
  };

  // GA4
  gtag('event', 'view_item', properties);

  // Mixpanel
  trackMixpanel('View Item', {
    ...properties,
    type: itemCategory,
  });
};

// Track lead generation (contact form and CTA)
export const trackLead = (formId?: string, ctaText?: string, ctaLocation?: string) => {
  if (formId) {
    const properties = {
      form_id: formId,
      form_name: 'Portfolio Contact',
    };

    // GA4
    gtag('event', 'generate_lead', properties);

    // Mixpanel
    trackMixpanel('Generate Lead', {
      source: 'form',
      ...properties,
    });
  } else if (ctaText && ctaLocation) {
    const properties = {
      cta_text: ctaText,
      cta_location: ctaLocation,
    };

    // GA4
    gtag('event', 'generate_lead', properties);

    // Mixpanel
    trackMixpanel('Generate Lead', {
      source: 'cta',
      ...properties,
    });
  }
};

// Track external link clicks
export const trackExternalLink = (linkType: string, destinationUrl: string) => {
  const properties = {
    content_type: 'external_link',
    item_id: linkType,
    destination_url: destinationUrl,
  };

  // GA4
  gtag('event', 'select_content', properties);

  // Mixpanel
  trackMixpanel('Click External Link', {
    link_type: linkType,
    destination: destinationUrl,
  });
};
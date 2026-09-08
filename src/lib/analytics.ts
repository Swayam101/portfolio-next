// GA4 Analytics Tracking Utility
// Minimal setup for portfolio website

// Safe gtag call that won't break if GA isn't loaded
const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args);
  }
};

// Track item view (projects and blog posts)
export const trackViewItem = (itemId: string, itemName: string, itemCategory: 'project' | 'blog_post', item_list_name?: string) => {
  gtag('event', 'view_item', {
    item_id: itemId,
    item_name: itemName,
    item_category: itemCategory,
    item_list_name: item_list_name,
  });
};

// Track lead generation (contact form and CTA)
export const trackLead = (formId?: string, ctaText?: string, ctaLocation?: string) => {
  if (formId) {
    gtag('event', 'generate_lead', {
      form_id: formId,
      form_name: 'Portfolio Contact',
    });
  } else if (ctaText && ctaLocation) {
    gtag('event', 'generate_lead', {
      cta_text: ctaText,
      cta_location: ctaLocation,
    });
  }
};

// Track external link clicks
export const trackExternalLink = (linkType: string, destinationUrl: string) => {
  gtag('event', 'select_content', {
    content_type: 'external_link',
    item_id: linkType,
    destination_url: destinationUrl,
  });
};
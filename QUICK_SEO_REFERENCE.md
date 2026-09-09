# 🚀 Quick SEO Reference Card

## ✅ What You Have Now

### Standard Next.js SEO Files (All Implemented ✅)

| File | URL | Purpose |
|------|-----|---------|
| `robots.ts` | `/robots.txt` | Crawl rules |
| `sitemap.ts` | `/sitemap.xml` | All URLs |
| `manifest.ts` | `/manifest.json` | PWA config |
| `opengraph-image.tsx` | `/opengraph-image` | Social card |
| `icon.tsx` | `/icon` | Favicon |
| `apple-icon.tsx` | `/apple-icon` | iOS icon |

### Dynamic Per-Page (All Implemented ✅)

- ✅ Project OG images: `/projects/[slug]/opengraph-image`
- ✅ Blog OG images: `/blog/[slug]/opengraph-image`

---

## 📋 After Deployment - Do This

### Immediately

1. **Verify URLs work:**
   ```
   ✓ https://www.swayam.cyou/robots.txt
   ✓ https://www.swayam.cyou/sitemap.xml
   ✓ https://www.swayam.cyou/manifest.json
   ```

2. **Add to Google Search Console:**
   - Visit: https://search.google.com/search-console
   - Add property: `https://www.swayam.cyou`
   - Get verification code
   - Add to `layout.tsx` → `verification.google`
   - Submit sitemap: `/sitemap.xml`

3. **Test Social Cards:**
   - Twitter: https://cards-dev.twitter.com/validator
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/

---

## 🎯 File Locations (Quick Reference)

```
src/app/
├── robots.ts                           # Crawl rules
├── sitemap.ts                          # URL list
├── manifest.ts                         # PWA config
├── opengraph-image.tsx                 # Home OG image
├── icon.tsx                            # Favicon
├── apple-icon.tsx                      # iOS icon
├── layout.tsx                          # Enhanced metadata ⭐
├── projects/[slug]/
│   └── opengraph-image.tsx             # Project OG images
└── blog/[slug]/
    └── opengraph-image.tsx             # Blog OG images
```

---

## 🔧 Common Updates

### Add Google Verification Code

File: `src/app/layout.tsx`

```typescript
verification: {
  google: "YOUR_CODE_HERE", // Replace placeholder
  yandex: "YOUR_CODE_HERE", // Optional
},
```

### Test PWA Install

1. Open in Chrome on Android
2. Look for "Install app" banner
3. DevTools → Application → Manifest

### Clear Social Cache

If OG image doesn't update:
- **Twitter**: https://cards-dev.twitter.com/validator
- **Facebook**: https://developers.facebook.com/tools/debug/
- **LinkedIn**: https://www.linkedin.com/post-inspector/

---

## 📊 Expected Lighthouse Scores

| Metric | Target |
|--------|--------|
| SEO | 100 ✅ |
| PWA | 100 ✅ |
| Performance | 90+ |
| Accessibility | 90+ |

Run test: Chrome DevTools → Lighthouse → Generate Report

---

## 🎨 Visual Assets Generated

| Asset | Size | Used For |
|-------|------|----------|
| OG Images | 1200×630 | Twitter, Facebook, LinkedIn, WhatsApp |
| Favicon | 32×32 | Browser tabs |
| Apple Icon | 180×180 | iOS home screen |

---

## 💡 Quick Tips

1. **Sitemap auto-updates** on every build ✅
2. **OG images are cached** by social platforms (~7 days)
3. **PWA requires HTTPS** (you have this ✅)
4. **Test locally:** `npm run build && npm run start`

---

## 🎉 You're Ready!

All standard SEO files implemented. Deploy and submit to search engines! 🚀

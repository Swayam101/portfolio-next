# Mobile Performance Optimization Plan

## Current Status (Mobile - September 10, 2026)

### Overall Performance Score: **77/100** (Needs Improvement)

### Key Metrics
- **First Contentful Paint (FCP)**: 3.0s (Score: 0.48) ⚠️
- **Largest Contentful Paint (LCP)**: 4.2s (Score: 0.45) ⚠️
- **Speed Index**: 5.1s (Score: 0.61) ⚠️
- **Time to Interactive (TTI)**: 7.3s (Score: 0.49) ⚠️
- **Total Blocking Time (TBT)**: Good (Score: 1.00) ✅
- **Cumulative Layout Shift (CLS)**: 0.0027 (Score: 1.00) ✅

### Critical Issues

#### 1. **Unused JavaScript** (Highest Priority)
- **Potential Savings**: 170 KiB
- **Impact**: 150ms savings on LCP
- **Score**: 0/100

#### 2. **Main Thread Work**  
- **Time Spent**: 5.05 seconds
- **Score**: 0/100
- Too much JavaScript parsing, compiling, and executing

#### 3. **JavaScript Execution Time**
- **Time Spent**: 3.2 seconds
- **Score**: 0/100
- Heavy JS payloads blocking the main thread

---

## Optimization Action Plan

### Phase 1: Code Splitting & Lazy Loading (Immediate Impact)

#### 1.1 Dynamic Imports for Non-Critical Components
```typescript
// Instead of:
import HeavyComponent from './HeavyComponent';

// Use:
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // For client-only components
});
```

**Components to Lazy Load:**
- Blog content
- Admin panel
- Image galleries
- Animation libraries
- Form components (until needed)

#### 1.2 Route-Based Code Splitting
Next.js already does this, but ensure you're not importing heavy libraries at the top level:

```typescript
// ❌ Bad - loads everywhere
import { AnimationLibrary } from 'heavy-animation-lib';

// ✅ Good - load only where needed
const SomeAnimatedPage = () => {
  const [AnimLib, setAnimLib] = useState(null);
  
  useEffect(() => {
    import('heavy-animation-lib').then(lib => setAnimLib(lib));
  }, []);
};
```

### Phase 2: Optimize Third-Party Scripts

#### 2.1 Defer Non-Critical Scripts
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</_next/static/chunks/main.js>; rel=preload; as=script',
          },
        ],
      },
    ];
  },
};
```

#### 2.2 Use Next.js Script Component
```tsx
import Script from 'next/script';

// Load analytics after page is interactive
<Script
  src="https://analytics.example.com/script.js"
  strategy="lazyOnload"
/>

// Load critical scripts with proper strategy
<Script
  src="https://critical-script.com/script.js"
  strategy="afterInteractive"
/>
```

### Phase 3: Image Optimization

#### 3.1 Ensure All Images Use Next/Image
```tsx
import Image from 'next/image';

// ✅ With proper sizing
<Image
  src="/astronaut.webp"
  width={600}
  height={400}
  alt="Astronaut"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### 3.2 Implement Priority Loading
```tsx
// Hero images only
<Image
  src="/hero.webp"
  priority
  quality={85}
/>

// Everything else
<Image
  src="/content.webp"
  loading="lazy"
/>
```

### Phase 4: Font Optimization

#### 4.1 Optimize Custom Fonts
```tsx
// app/layout.tsx
import localFont from 'next/font/local';

const americanFont = localFont({
  src: [
    {
      path: '../public/fonts/american.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap', // Prevents FOIT
  preload: true,
  fallback: ['Arial', 'sans-serif'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={americanFont.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Phase 5: Bundle Analysis & Tree Shaking

#### 5.1 Install Bundle Analyzer
```bash
npm install --save-dev @next/bundle-analyzer
```

#### 5.2 Update next.config.ts
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... existing config
});
```

#### 5.3 Analyze Bundles
```bash
ANALYZE=true npm run build
```

**Look for:**
- Duplicate dependencies
- Unused libraries
- Large third-party packages
- Code that can be lazy-loaded

### Phase 6: React Optimization

#### 6.1 Implement React.memo for Heavy Components
```tsx
import { memo } from 'react';

const HeavyComponent = memo(({ data }) => {
  // Heavy rendering logic
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id;
});
```

#### 6.2 Use useMemo and useCallback
```tsx
const MemoizedComponent = () => {
  // Expensive calculation
  const expensiveValue = useMemo(() => {
    return heavyCalculation(data);
  }, [data]);

  // Prevent re-renders
  const handleClick = useCallback(() => {
    doSomething();
  }, []);

  return <Child onClick={handleClick} value={expensiveValue} />;
};
```

### Phase 7: Server Components (Next.js 14+)

#### 7.1 Convert Static Components to Server Components
```tsx
// app/components/StaticContent.tsx
// This is a Server Component by default in app directory

export default async function StaticContent() {
  // Fetch data on server
  const data = await fetch('...').then(r => r.json());
  
  return (
    <div>
      {/* No client-side JS needed */}
      {data.items.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}
```

#### 7.2 Mark Client Components Explicitly
```tsx
'use client'; // Only add when you need interactivity

import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Phase 8: Caching Strategy

#### 8.1 Implement ISR (Incremental Static Regeneration)
```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(`/api/blog/${params.slug}`).then(r => r.json());
  return <Article post={post} />;
}
```

#### 8.2 Add Aggressive Browser Caching
```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Phase 9: Compression & Minification

#### 9.1 Ensure Compression is Enabled
```typescript
// next.config.ts
module.exports = {
  compress: true, // Enabled by default
  
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    return config;
  },
};
```

#### 9.2 Remove Console Logs in Production
```typescript
// next.config.ts
module.exports = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        })
      );
    }
    return config;
  },
};
```

### Phase 10: Critical CSS

#### 10.1 Inline Critical CSS
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold CSS */
            body { margin: 0; font-family: system-ui; }
            .hero { min-height: 100vh; display: flex; }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Implementation Priority

### Week 1: Quick Wins (Target: +10-15 points)
1. ✅ Add dynamic imports for heavy components
2. ✅ Defer third-party scripts
3. ✅ Optimize all images with next/image
4. ✅ Add font-display: swap

### Week 2: Code Splitting (Target: +5-10 points)
1. ✅ Analyze bundle with @next/bundle-analyzer
2. ✅ Split large components
3. ✅ Implement route-based code splitting
4. ✅ Remove unused dependencies

### Week 3: React Optimization (Target: +3-5 points)
1. ✅ Add React.memo to heavy components
2. ✅ Implement useMemo/useCallback
3. ✅ Convert to Server Components where possible

### Week 4: Caching & Polish (Target: +2-3 points)
1. ✅ Implement ISR
2. ✅ Optimize cache headers
3. ✅ Remove console logs
4. ✅ Final testing and tweaks

---

## Expected Results

### Target Performance Score: **90+/100**

### Expected Improvements:
- **FCP**: 3.0s → **1.8s** (Improve by ~40%)
- **LCP**: 4.2s → **2.5s** (Improve by ~40%)
- **TTI**: 7.3s → **3.5s** (Improve by ~52%)
- **JavaScript Execution**: 3.2s → **1.5s** (Improve by ~53%)

---

## Monitoring & Testing

### Tools to Use:
1. **Lighthouse** (Chrome DevTools) - Mobile emulation
2. **PageSpeed Insights** - Real-world data
3. **WebPageTest** - Detailed waterfall analysis
4. **Chrome User Experience Report** - Field data

### Test on Real Devices:
- Test on actual mobile devices (not just emulation)
- Test on 3G/4G networks (throttle in DevTools)
- Test on low-end devices

### Continuous Monitoring:
```bash
# Add to CI/CD pipeline
npm run build
lighthouse https://www.swayam.cyou --only-categories=performance --preset=mobile --output=json --output-path=./lighthouse-report.json
```

---

## Notes

- Desktop performance is already good (mentioned by user)
- Focus entirely on mobile optimization
- Monitor Core Web Vitals in production
- Consider implementing a performance budget
- Track performance regressions in CI/CD

---

## Additional Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/learn-core-web-vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

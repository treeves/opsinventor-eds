<!-- stardust:provenance
writtenBy: stardust:direct
writtenAt: 2026-05-09T15:30:20Z
againstDirection: "Modernize as advanced consultancy, article-first beauty, image-based palette"
synthesized: "consultancy visual system, token contract, palette replacement, editorial hierarchy"
authoredByUser: "modernization goals and attached palette image"
readArtifacts: ["stardust/current/home.raw.html", "stardust/current/home.detect.json", "stardust/current/pages/*.json", "stardust/direction.md", ".agents/skills/stardust/reference/intent-dimensions.md"]
-->

# OpsInventor Visual Design System

## Current State (WordPress)

### Typography

- **Primary font:** Roboto (detected via Impeccable, flagged as overused)
- **Scale:** Limited (3–4 sizes observed)
- **Weight distribution:** Heavy reliance on weight for hierarchy
- **Line height:** Tight to moderate

### Color Palette

- **Primary:** Dark gray/charcoal (#333, #444)
- **Accent:** Limited secondary colors
- **Background:** Off-white/light gray
- **Text:** High contrast dark-on-light

### Spacing & Rhythm

- **Section padding:** 40–48px (product-register density)
- **Section count:** 7+ on home page (multi-audience IA)
- **Grid:** 12-column, responsive at mobile

### Components

- **Typography:** Headings, body text, blockquotes
- **Navigation:** Header nav, footer links
- **Content:** Article cards, inline images, metadata strips
- **Forms:** Search box

### Accessibility Issues Flagged

- Overused font (Roboto) — low distinctiveness signal
- Skipped heading level (h1 → h3, missing h2) — violates WCAG 2.4.3

---

## Target Direction: "Modern Advanced Consultancy, Article-First"

### Redesign Intent

Move from a generic blog aesthetic to a consultancy-grade editorial system:

- Modern, high-trust, strategic visual posture
- Content-first composition where each article feels crafted
- Distinctive but disciplined palette from the supplied image
- Explicitly ignore existing brand colors

### Strategic Moves

1. **Typography**
   - Replace Roboto with a premium editorial serif for long-form reading and a precise sans for interface/meta.
   - Increase hierarchy clarity for consultancy scanning: insight headline, summary, evidence, conclusion.
   - Make article pages the typographic hero product, not just list cards.
   - Improve code, quote, and callout styling for advanced technical commentary.

2. **Color & Visual Language**
   - Adopt image-derived palette as source of truth and deprecate legacy brand colors.
   - Use deep teal inks for trust and stability; copper/orange accents for calls-to-action and key emphasis.
   - Keep backgrounds restrained so article content and data visuals remain dominant.
   - Maintain WCAG AA contrast for all text and interactive states.

3. **Layout & Density**
   - Keep balanced density with strong rhythm for long reads and executive skimming.
   - Introduce a consultancy-style grid: strong headline rail, readable body measure, disciplined metadata row.
   - Reduce blog clutter and ornamental noise; every block must support understanding.
   - Prioritize featured insights and thematic collections over date-only chronology.

4. **Components**
   - Redesign article cards as insight briefs with clear value proposition and reading time.
   - Elevate metadata (authority cues, topic tags, publish context) with cleaner structure.
   - Upgrade CTA components to consultancy language and stronger intent hierarchy.
   - Build a refined table/callout style for technical depth inside articles.

5. **Accessibility Fixes**
   - Correct heading hierarchy (add missing h2)
   - Ensure all color changes maintain WCAG AA contrast
   - Verify focus states and keyboard navigation

---

## Design System Tokens (Draft)

### Typography

```
--font-display: "custom-editorial-serif", serif (TBD)
--font-body: "custom-editorial-sans", sans-serif (TBD)

--fontSize-display: 3.5rem, 2.5rem, 2rem
--fontSize-heading: 1.75rem, 1.5rem, 1.25rem
--fontSize-body: 1rem
--fontSize-meta: 0.875rem

--fontWeight-light: 300
--fontWeight-regular: 400
--fontWeight-semibold: 600
--fontWeight-bold: 700
```

### Color

```
--color-ink-900: #124953
--color-ink-700: #17828D
--color-ink-500: #39AAB5
--color-accent-500: #CE5B12
--color-accent-700: #92470D
--color-bg-900: #0B1115
--color-surface-0: #F6FAFB
--color-text-primary: #0E1B22
--color-text-muted: #35525C
--color-link: #17828D
--color-link-hover: #124953
--color-cta-bg: #CE5B12
--color-cta-bg-hover: #92470D
--color-cta-text: #FFFFFF
--color-border-subtle: #BFD5DB
```

### Spacing

```
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px

--spacing-section-padding-desktop: 64px
--spacing-section-padding-mobile: 32px
```

### Borders & Shadows

```
--border-radius: 4px
--shadow-sm: 0 1px 2px rgba(11, 17, 21, 0.12)
--shadow-md: 0 8px 24px rgba(11, 17, 21, 0.16)
```

## Palette source

The active palette is derived from the user-supplied image and is now the default color contract for prototypes and migration output.

---

## Approval & Migration Notes

- Target design will be validated via prototype before migration
- DESIGN.json companion sidecar will be generated once design tokens are finalized
- AEM Edge Delivery Services uses CSS custom properties (`:root`) to expose all tokens
- All pages will carry data attributes for structural context and A/B testing

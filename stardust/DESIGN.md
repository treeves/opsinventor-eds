<!-- stardust:provenance
writtenBy: stardust:direct
writtenAt: 2026-05-19T00:00:00Z
-->

# DESIGN — Tad Reeves / OpsInventor

## Design principles
1. **Hard edges, no soft gradients.** Accent color is applied as solid blocks, borders, fills — never as a blend.
2. **No serif fonts.** Serifs read corporate in this context; we want kinetic and modern.
3. **Oversized display type.** Headlines lean into Archivo Black / Inter Black with tight tracking.
4. **Mountain imagery as motif.** Used in hero, section dividers, and section backgrounds with strong dark overlays for legibility.
5. **Monospace as a textural accent.** Eyebrows, tags, and meta use Space Mono for technical credibility.

## Type system
- **Display**: Archivo Black, 900 weight, tight letter-spacing (-0.02em to -0.03em). For h1/h2 hero and section headlines.
- **Body / UI**: Inter, 400–700 weights. Default body 16–17px, line-height 1.65.
- **Mono**: Space Mono, 400/700. For eyebrows, tags, technical labels, ticker. Always uppercase, 0.12–0.20em letter-spacing.

## Color tokens (hard)
| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B1115` | Page dark, nav, hero left, footer |
| `--ink-2` | `#0F1C23` | Panel dark, section background |
| `--orange` | `#CE5B12` | **Hard accent.** Buttons, borders, hero right, CTA bands, ticker accent |
| `--orange-dk` | `#92470D` | Hover state, second tier |
| `--teal` | `#39AAB5` | Secondary accent, eyebrow on dark |
| `--teal-dk` | `#17828D` | Eyebrow on light |
| `--surface` | `#F6FAFB` | Light section background |
| `--white` | `#FFFFFF` | Cards |
| `--text` | `#0E1B22` | Body text on light |
| `--muted` | `#35525C` | Secondary text on light |
| `--border` | `#BFD5DB` | Card edges |

## Shape
- **Border-radius: 0.** Everywhere. Hard rectangles.
- **Border weight**: 3px (section markers), 2px (buttons), 1px (cards).
- **Accent bars**: 4–6px solid orange for section headers and feature blocks.

## Imagery
- Mountain / mountain biking photography — duotone overlay (ink × orange) acceptable.
- Always with a 60–80% dark gradient on hero placements for headline legibility.
- YouTube speaking-engagement thumbnails used native (no overlay) inside cards with orange top-border on hover.

## Motion
- Ticker band: 22s linear infinite.
- Hover transitions: 0.15s ease.
- No bouncy easings, no parallax.

## Layout
- Container: `min(1140px, 92vw)`.
- Section padding: `64px clamp(24px, 5vw, 60px)`.
- Hard splits (50/50 hero) preferred over centered hero compositions.

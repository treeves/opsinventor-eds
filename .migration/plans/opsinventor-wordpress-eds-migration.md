# OpsInventor WordPress to Edge Delivery Services Migration Plan

## Overview

Migrate **https://www.opsinventor.com/** (WordPress blog, ~243 posts dating from 2006-2026) to Adobe Edge Delivery Services. Posts will live under `/en/` for future localization. No sidebar content or footers will be migrated. The homepage will be a post index with the 5 most recent posts featured at top.

## Parameters & Constraints

- **Pixel perfection**: Not required — functional fidelity is the goal
- **Post location**: All posts under `/en/` subtree (e.g., `/en/testing-geo-seo-with-adobe-llm-optimizer`)
- **Sidebar**: Excluded entirely (no archives, no recent comments, no Flickr, no top posts)
- **Footer**: Not migrated
- **Homepage**: Custom index page listing posts, with 5 most recent grouped at top
- **Total pages**: ~243 posts + 2 static pages (About, About Me) + homepage

## Site Analysis

| Property | Value |
|----------|-------|
| Source CMS | WordPress |
| Post count | ~243 (sitemap-1.xml) |
| Date range | 2006–2026 |
| Categories | AEM/CQ, general tech, personal |
| Post template | Single layout: hero (featured image + title + date + author) → article body |
| Static pages | About, About Me, Combat Engineering |
| Sidebar widgets | Most Recent, Top Posts, Recent Comments, Flickr, Archives |
| Existing EDS blocks | `blog-post-hero`, `card`, `columns`, `hero`, `header`, `footer`, `youtube`, `spotify`, `table`, `author-rows` |

## Checklist

### Phase 1: Site & Template Analysis
- [ ] **1.1** Run site analysis to create/update page templates for all URL patterns (blog posts, static pages)
- [ ] **1.2** Classify all ~243 post URLs + static pages into templates
- [ ] **1.3** Run page analysis on 2-3 representative posts to confirm block mappings (hero, body content, embedded media)
- [ ] **1.4** Update `page-templates.json` with finalized block mappings and all URLs

### Phase 2: Design System
- [ ] **2.1** Extract design tokens from opsinventor.com (colors, typography, spacing)
- [ ] **2.2** Map tokens to EDS CSS custom properties in `styles/styles.css` and `styles/fonts.css`
- [ ] **2.3** Verify global styles render correctly in local preview

### Phase 3: Navigation
- [ ] **3.1** Set up header navigation (Home, About, AEM/CQ links — no search widget)
- [ ] **3.2** Verify nav renders in local preview

### Phase 4: Import Infrastructure
- [ ] **4.1** Build/update block parsers for `blog-post-hero` and any additional block variants found during analysis
- [ ] **4.2** Build page transformer to strip sidebar content, footer, and remap paths to `/en/` subtree
- [ ] **4.3** Handle embedded media (YouTube, Spotify embeds → auto-blocks)
- [ ] **4.4** Build import script combining parsers + transformers

### Phase 5: Content Import — Blog Posts
- [ ] **5.1** Run bulk import for all ~243 blog post URLs into `/content/en/`
- [ ] **5.2** Verify a sample of imported posts in local preview (spot-check 5-10 posts across date range)
- [ ] **5.3** Fix any systematic import issues found during spot-checks
- [ ] **5.4** Re-import any failed or problematic posts

### Phase 6: Static Pages
- [ ] **6.1** Import About / About Me pages into `/content/en/`
- [ ] **6.2** Verify static pages in local preview

### Phase 7: Homepage (Index)
- [ ] **7.1** Create query index configuration in `helix-query.yaml` to index posts by date
- [ ] **7.2** Build or configure a post-listing block for the homepage (card-based layout)
- [ ] **7.3** Create `/content/en/index.html` with featured top-5 section + full post listing
- [ ] **7.4** Verify homepage renders with post cards in local preview

### Phase 8: Final Verification
- [ ] **8.1** Spot-check 10+ posts across different years/categories
- [ ] **8.2** Verify navigation links work
- [ ] **8.3** Verify homepage post listing populates correctly
- [ ] **8.4** Check responsive rendering (mobile/tablet widths)

## Architecture Decisions

1. **Single blog-post template** — The WordPress site uses one post layout consistently. One template with `blog-post-hero` + default content body covers all posts.
2. **`/en/` subtree** — All content lives under `/en/` from day one, enabling future locale folders (`/de/`, `/ja/`, etc.) without restructuring.
3. **No sidebar blocks** — Sidebar content (archives, Flickr, top posts) is excluded per requirements. The page transformer will strip the sidebar DOM before parsing.
4. **No footer migration** — Footer will use the EDS default or a minimal custom footer.
5. **Homepage as post index** — Uses EDS query index + a card/listing block to dynamically display posts sorted by date. Top 5 featured prominently, remainder in a compact list.
6. **Embedded media** — YouTube and Spotify embeds already have corresponding blocks in the project. The import will auto-detect embed URLs and map them.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Some older posts may have broken images or dead links | Spot-check across date range; accept dead external links as-is |
| Post slugs may collide after `/en/` prefix | Slugs are already unique on the source site |
| Embedded content (iframes, widgets) may not all parse cleanly | Handle YouTube/Spotify explicitly; flag other embeds during import for manual review |
| ~243 posts is a large bulk import | Batch in groups; verify incrementally |

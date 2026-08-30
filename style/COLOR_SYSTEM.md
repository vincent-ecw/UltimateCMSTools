# Design Token Color System Reference

This document describes the design token architecture used by the **Ultimate CMS Tools** plugin and client themes.

---

## 1. Three-Tier Token Architecture

The design token system in [`variables-shopware-legacy.css`](variables-shopware-legacy.css) is organized into three distinct tiers:

```
[ Tier 1: Global Tokens ]
   --ecw-global-color-blue-500: #0a4067;
   --ecw-global-color-grey-200: #c3d3e2;
          ↓
[ Tier 2: Alias Tokens ]
   --ecw-alias-color-primary-500: var(--ecw-global-color-blue-500);
   --ecw-alias-color-neutrals-200: var(--ecw-global-color-grey-200);
          ↓
[ Tier 3: Mapped / Semantic Tokens ]  <-- ONLY THESE ARE USED IN COMPONENTS & BLOCKS
   --ecw-mapped-color-border-base: var(--ecw-alias-color-neutrals-200);
   --ecw-mapped-color-button-navigation-active: var(--ecw-alias-color-secondary-500);
```

### Golden Rule
> **In CMS block / element styling, ONLY tokens starting with `--ecw-mapped-color-` can be used.**
> Global and Alias tokens are system-internal definitions and must never be referenced directly in components or stylesheets.

---

## 2. Mandatory 3-Tier Fallback Mechanism

When applying color tokens in SCSS or CSS, every variable call **MUST** provide fallbacks:
1. **Tier 1:** `--ecw-mapped-color-*` (The design token variable)
2. **Tier 2:** `--bs-*` (Bootstrap 5 standard CSS variable)
3. **Tier 3:** Fixed color value (hex/rgba literal)

```scss
/* Example in SCSS: */
.my-card {
    background-color: var(--ecw-mapped-color-background-container, var(--bs-card-bg, #ffffff));
    border: 1px solid var(--ecw-mapped-color-border-base, var(--bs-border-color, #e2e8f0));
    color: var(--ecw-mapped-color-text-normal, var(--bs-body-color, #333333));
}

.my-card-title {
    color: var(--ecw-mapped-color-textcolor, var(--bs-heading-color, #111111));
}

.my-card-badge {
    background-color: var(--ecw-mapped-color-pill-primary-back, var(--bs-primary, #0d6efd));
    color: var(--ecw-mapped-color-pill-primary-lighttext, var(--bs-white, #ffffff));
}
```

---

## 3. Complete Catalog of Mapped Color Variables

### Backgrounds & Surfaces
- `--ecw-mapped-color-background-body`: Primary body/page background
- `--ecw-mapped-color-background-container`: Component/card background
- `--ecw-mapped-color-table-header_back`: Subtle/neutral light surface (e.g. image placeholder, header)
- `--ecw-mapped-color-table-back`: Standard table / list background
- `--ecw-mapped-color-table-back_odd`: Odd row table background
- `--ecw-mapped-color-table-back_even`: Even row / alternating stripe background
- `--ecw-mapped-color-header-back`: Top header background
- `--ecw-mapped-color-header-colored-back`: Dark / highlighted header background
- `--ecw-mapped-color-header-category-back`: Category hero minimal background
- `--ecw-mapped-color-footer-back`: Footer background
- `--ecw-mapped-color-footer-top-back`: Footer top section background

### Text & Typography
- `--ecw-mapped-color-textcolor`: Headings, main block titles, strong accents
- `--ecw-mapped-color-text-header`: Header / element headings accent
- `--ecw-mapped-color-text-normal`: Paragraphs, card descriptions, body copy
- `--ecw-mapped-color-text-meta`: Subtitles, dates, meta captions, breadcrumbs
- `--ecw-mapped-color-text-link`: Hyperlink text
- `--ecw-mapped-color-text-linkhover`: Hyperlink hover state
- `--ecw-mapped-color-cta-lighttext`: White / light text for dark backgrounds
- `--ecw-mapped-color-header-lighttext`: White / light text for header/hero overlays
- `--ecw-mapped-color-footer-lighttext`: White / light text for footer surfaces
- `--ecw-mapped-color-disabled-text`: Muted / disabled text

### Borders & Dividers
- `--ecw-mapped-color-border-base`: Default border for cards, inputs, containers
- `--ecw-mapped-color-border-select`: Active / selected / focused border
- `--ecw-mapped-color-media-border-color`: Media / image borders
- `--ecw-mapped-color-media-border-hover`: Media border hover state
- `--ecw-mapped-color-media-border-active`: Media border active state
- `--ecw-mapped-color-disabled-border`: Disabled element border

### Interactive & Navigation Controls
- `--ecw-mapped-color-slider-dot-active`: Slider navigation active dot
- `--ecw-mapped-color-slider-dot-color`: Slider navigation inactive dot
- `--ecw-mapped-color-slider-dot-hover`: Slider navigation hover dot
- `--ecw-mapped-color-button-navigation-active`: Active dot / carousel indicator, active arrow hover
- `--ecw-mapped-color-button-navigation-disabled`: Inactive dot / carousel indicator
- `--ecw-mapped-color-button-navigation-hover`: Hover state for slider dots
- `--ecw-mapped-color-button-navigation-back`: Navigation button background
- `--ecw-mapped-color-button-navigation-text`: Navigation button icon/text

### Buttons & CTAs
- `--ecw-mapped-color-iconlist-icon`: Icon list item icon color
- `--ecw-mapped-color-cta-primarycolor`: Primary CTA accent (buttons, highlighted stats)
- `--ecw-mapped-color-cta-secondarycolor`: Secondary CTA accent (icons, sub-buttons)
- `--ecw-mapped-color-button-primary-back`: Primary button background
- `--ecw-mapped-color-button-primary-text`: Primary button text
- `--ecw-mapped-color-button-primary-hover`: Primary button hover background
- `--ecw-mapped-color-button-primary-border`: Primary button border
- `--ecw-mapped-color-button-primary-lighttext`: Primary button light text
- `--ecw-mapped-color-button-secondary-back`: Secondary button background
- `--ecw-mapped-color-button-secondary-text`: Secondary button text
- `--ecw-mapped-color-button-banner-primary`: Banner primary button
- `--ecw-mapped-color-button-banner-secondary`: Banner secondary button
- `--ecw-mapped-color-button-banner-tertiary`: High-contrast pop / accent banner button

### Badges & Pills
- `--ecw-mapped-color-pill-primary-back`: Primary badge background
- `--ecw-mapped-color-pill-primary-lighttext`: Primary badge light text
- `--ecw-mapped-color-pill-secondary-back`: Secondary badge background
- `--ecw-mapped-color-pill-secondary-lighttext`: Secondary badge light text
- `--ecw-mapped-color-pill-tertiary-back`: Dark / tertiary badge background
- `--ecw-mapped-color-pill-tertiary-lighttext`: Dark / tertiary badge light text

### Quotes & Testimonials
- `--ecw-mapped-color-quote-normaltext`: Quote author / body copy
- `--ecw-mapped-color-quote-primarytext`: Quote highlight / quote marks
- `--ecw-mapped-color-quote-primaryback`: Quote background gradient start
- `--ecw-mapped-color-quote-secondaryback`: Quote background gradient end

### Status & Feedback (Stock / Alerts)
- `--ecw-mapped-color-alert-success` / `--ecw-mapped-color-stock-instock`: Success state
- `--ecw-mapped-color-alert-warning` / `--ecw-mapped-color-stock-lowstock`: Warning state
- `--ecw-mapped-color-alert-error` / `--ecw-mapped-color-stock-nostock`: Error / danger state
- `--ecw-mapped-color-alert-info`: Info alert state

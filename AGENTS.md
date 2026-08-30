# Ultimate CMS Tools - Agent Development Guide

This repository contains the **Ultimate CMS Tools** plugin for Shopware 6.7.

---

## 1. Design Token Color System & Styling Guidelines

The plugin uses a design token color architecture based on [`style/variables-shopware-legacy.css`](style/variables-shopware-legacy.css).

### Strict Rules for Color Assignment

1. **Rule 1 — Only Mapped Variables:**
   - **ONLY** variables starting with `--ecw-mapped-color-` may be used when assigning colors in stylesheets, templates, or components.
   - **NEVER** directly use `--ecw-global-color-*` or `--ecw-alias-color-*` variables in component styles. Those exist solely as internal layers of the design token system.

2. **Rule 2 — Mandatory 3-Tier Fallback Pattern:**
   Every color declaration **MUST** follow the 3-tier fallback chain:
   ```scss
   /* Pattern: */
   property: var(--ecw-mapped-color-<token-name>, var(--bs-<bootstrap-var>, <fixed-fallback>));
   ```
   - **Tier 1 (Primary):** `--ecw-mapped-color-*` (Custom theme design token)
   - **Tier 2 (Secondary Fallback):** `--bs-*` / Bootstrap 5 CSS variable
   - **Tier 3 (Tertiary Fallback):** Fixed hex, RGB, or HSL color value

3. **Rule 3 — Fallback Mechanism Purpose:**
   This fallback structure ensures that all CMS blocks and elements seamlessly integrate into custom themes where `--ecw-mapped-color-*` tokens are defined, while remaining fully operational with standard styling when installed in standard Shopware shops without custom tokens.

---

### Mapped Variables Reference & Semantic Catalog

| Semantic Area | Design Token Variable (`--ecw-mapped-color-*`) | Recommended Fallback (`var(--bs-*, <fixed>)`](#) | Typical Use Cases |
| :--- | :--- | :--- | :--- |
| **Body & Card Background** | `--ecw-mapped-color-background-container` | `var(--bs-card-bg, #ffffff)` | Card backgrounds, modals, dropdowns |
| **Page Background** | `--ecw-mapped-color-background-body` | `var(--bs-body-bg, #ffffff)` | Section & page backgrounds |
| **Subtle / Neutral BG** | `--ecw-mapped-color-table-header_back` | `var(--bs-tertiary-bg, #f8f9fa)` | Light card headers, image placeholders, pill tags |
| **Alternating BG** | `--ecw-mapped-color-table-back_even` | `var(--bs-border-color, #cbd5e1)` | Divider lines, subtle stripes, borders |
| **Dark Theme BG** | `--ecw-mapped-color-header-colored-back` | `var(--bs-dark, #0b1329)` | Dark overlay cards, hero spotlight backgrounds |
| **Category Header BG** | `--ecw-mapped-color-header-category-back` | `var(--bs-tertiary-bg, #ebf1f6)` | Minimal category header background |
| **Headings & Main Titles** | `--ecw-mapped-color-textcolor` / `--ecw-mapped-color-text-header` | `var(--bs-heading-color, #111111)` | `<h1>`-`<h6>`, accordion titles, feature headers |
| **Body Text** | `--ecw-mapped-color-text-normal` | `var(--bs-body-color, #333333)` | Paragraphs, descriptions, general text |
| **Meta & Subtitle Text** | `--ecw-mapped-color-text-meta` | `var(--bs-secondary-color, #6c757d)` | Dates, subcaptions, author meta, secondary lines |
| **Links** | `--ecw-mapped-color-text-link` | `var(--bs-link-color, #0d6efd)` | Hyperlinks, inline text links |
| **Link Hover** | `--ecw-mapped-color-text-linkhover` | `var(--bs-link-hover-color, #0a58ca)` | Hover state for hyperlinks |
| **Light Text on Dark BG** | `--ecw-mapped-color-cta-lighttext` / `--ecw-mapped-color-header-lighttext` | `var(--bs-white, #ffffff)` | Text on dark backgrounds, hero text, badges |
| **Primary Accent & CTA** | `--ecw-mapped-color-cta-primarycolor` | `var(--bs-primary, #0d6efd)` | Primary buttons, active accents, statistics numbers |
| **Secondary Accent** | `--ecw-mapped-color-cta-secondarycolor` | `var(--bs-secondary, #6c757d)` | Secondary badges, icons, subheadings |
| **Icon List Icon** | `--ecw-mapped-color-iconlist-icon` | `var(--bs-primary, #0d6efd)` | Icon list items icon color |
| **Borders & Dividers** | `--ecw-mapped-color-border-base` | `var(--bs-border-color, #e2e8f0)` | Card borders, table dividers, input borders |
| **Active / Highlight Border**| `--ecw-mapped-color-border-select` | `var(--bs-primary, #0d6efd)` | Focused/active card borders, accent outlines |
| **Navigation Active / Dot** | `--ecw-mapped-color-slider-dot-active` / `--ecw-mapped-color-button-navigation-active` | `var(--bs-primary, #007bff)` | Carousel active dot, active slider nav arrows |
| **Navigation Inactive / Dot**| `--ecw-mapped-color-slider-dot-color` / `--ecw-mapped-color-button-navigation-disabled` | `var(--bs-border-color, #dee2e6)` | Carousel inactive dots |
| **Navigation Hover** | `--ecw-mapped-color-slider-dot-hover` / `--ecw-mapped-color-button-navigation-hover` | `var(--bs-secondary-bg, #007bff)` | Hovered carousel dots / controls |
| **Button Primary BG** | `--ecw-mapped-color-button-primary-back` | `var(--bs-primary, #0d6efd)` | Primary button background |
| **Button Primary Text** | `--ecw-mapped-color-button-primary-text` | `var(--bs-black, #000000)` | Primary button text |
| **Button Banner Tertiary** | `--ecw-mapped-color-button-banner-tertiary` | `var(--bs-warning, #fde047)` | Neo-brutalist pop background, highlight banners |
| **Badge Primary** | `--ecw-mapped-color-pill-primary-back` | `var(--bs-success, #5da36d)` | Primary category badges |
| **Badge Secondary** | `--ecw-mapped-color-pill-secondary-back` | `var(--bs-primary, #1d4e89)` | Secondary category badges |
| **Badge Tertiary** | `--ecw-mapped-color-pill-tertiary-back` | `var(--bs-dark, #0a1b30)` | Tertiary category badges |
| **Quote Primary Text** | `--ecw-mapped-color-quote-primarytext` | `var(--bs-primary-text-emphasis, #78350f)` | Magazine quote highlighted text |
| **Quote Normal Text** | `--ecw-mapped-color-quote-normaltext` | `var(--bs-body-color, #0f172a)` | Magazine quote base body text |
| **Quote Primary BG** | `--ecw-mapped-color-quote-primaryback` | `var(--bs-primary-bg-subtle, #fffbeb)` | Quote background gradient start |
| **Quote Secondary BG** | `--ecw-mapped-color-quote-secondaryback` | `var(--bs-secondary-bg-subtle, #fef3c7)` | Quote background gradient end |
| **Alert / Warning** | `--ecw-mapped-color-alert-warning` | `var(--bs-warning, #ffc107)` | Warning borders, notice boxes |
| **Alert / Success** | `--ecw-mapped-color-alert-success` | `var(--bs-success, #198754)` | Success badges, in-stock indicators |
| **Alert / Error** | `--ecw-mapped-color-alert-error` | `var(--bs-danger, #dc3545)` | Error alerts, out-of-stock badges |

For complete design token documentation, refer to [`style/COLOR_SYSTEM.md`](style/COLOR_SYSTEM.md).

---

## 2. Environment & Compilation

All Shopware commands **MUST** be run inside the Docker container `shopware67`.

```bash
# Build storefront assets (SCSS / JS)
docker exec -it shopware67 ./bin/build-storefront.sh

# Recompile theme
docker exec -it shopware67 bin/console theme:compile

# Clear cache
docker exec -it shopware67 bin/console cache:clear

# Build administration assets
docker exec -it shopware67 ./bin/build-administration.sh
```

---

## 3. Git Workflow & Release Rules

- **Branching:** Every modification **MUST** be performed in a dedicated feature or bug branch (e.g. `feature/my-new-feature` or `bugfix/my-fix`). **NEVER** edit or commit directly on the `main` branch.
- **Version Bumping:** Whenever modifying the plugin, increment the patch version in [`composer.json`](composer.json) by +1 (e.g., `1.2.20` → `1.2.21`).
- **Changelog:** Always document changes under a new version heading in [`CHANGELOG.md`](CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).
- **Readme:** Keep [`README.md`](README.md) updated when adding or modifying blocks, features, or design system components.

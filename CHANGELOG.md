# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.21] - 2026-08-30

### Changed
- Standardized all CMS Block and Element Storefront SCSS stylesheets to use the **Design Token Color System** with primary `--ecw-mapped-color-*` CSS variables and robust 3-tier fallbacks (`var(--ecw-mapped-color-<token>, var(--bs-<var>, <fixed-value>))`).
- Updated shared carousel navigation controls, indicator dots, category headers, CTA buttons and cards, custom carousels, FAQ harmonica, harmonica list, flexible image and text, icon list, image-text quartet, magazine quotes, manufacturer carousels/grids, statistics, and subcategory carousels/grids to seamlessly inherit custom theme tokens when installed in client shops while remaining fully functional on standard themes.

### Added
- Added `AGENTS.md` and `style/COLOR_SYSTEM.md` providing comprehensive design token rules, color catalog mappings, and development guidelines for future AI agents working on the plugin.

## [1.2.20] - 2026-08-30

### Added
- Added Schema.org `FAQPage` rich snippets (JSON-LD structured data) to **FAQ Harmonica** (`faq-harmonica`) storefront template, automatically generating valid questions (`@type: Question`) and answers (`@type: Answer`) for SEO indexing.
- Added new **Harmonica List** (`harmonica-list`) CMS block and element as a non-FAQ accordion list offering the identical features, collapse behavior, and 5 theme variations (`clean`, `boxed`, `pill-block`, `editorial-numbered`, `accent-line`) without FAQ structured data markup.
- Added English, German, and Dutch snippet translations for the new Harmonica List CMS block and element.

### Changed
- Optimized accordion signifiers across all 5 themes in both **FAQ Harmonica** (`faq-harmonica`) and **Harmonica List** (`harmonica-list`) based on Nielsen Norman Group (NN/g) usability research: standardized on rotating caret/chevron signifiers pointing downward when closed and smoothly rotating 180° when expanded, eliminating navigation-ambiguous right arrows.

## [1.2.19] - 2026-08-30

### Fixed
- Fixed **Responsive Image** (`responsive-image`) administration preview component to dynamically display the media image according to the selected editor device view switch position (Desktop, Tablet, Mobile) and image availability fallbacks.
- Added asynchronous media entity loading in Administration layout editor component when opening saved layouts or updating configurations.
- Added explicit `defaultData` registration (`mediaDesktop`, `mediaTablet`, `mediaMobile`) and reactive object replacement in element configuration handlers to ensure instant Vue 3 preview reactivity.

## [1.2.18] - 2026-08-06

### Added
- Added theme selection capability to **FAQ Harmonica** (`faq-harmonica`) CMS element with 5 theme variations: Minimal Clean Dividers (`clean`), Floating Cards (`boxed`), Accent Toggle Block (`pill-block`), Modern Numbered (`editorial-numbered`), and Left Accent Border (`accent-line`).
- Added theme configuration tab in Administration editor for FAQ Harmonica with Vue 3 reactive getter/setter and `v-model:value` binding.
- Updated Storefront Twig and SCSS templates to dynamically adapt FAQ Harmonica themes to the active Shopware theme colors (`$primary`, `$secondary`, `$tertiary`, `$border-color`, `$card-bg`).

## [1.2.17] - 2026-08-06

### Fixed
- Fixed vertical alignment of button icons (`btn-icon-before`, `btn-icon-after`, `icon`) and button text (`btn-text`) in the **Button** CMS element (`cms-element-button`) and Administration editor/preview components to ensure icons and text are strictly centered vertically regardless of theme font metrics or button line-height overrides.

## [1.2.16] - 2026-08-06

### Fixed
- Fixed **Category Header** (`category-header`) Design 5 (Diagonal Split) diagonal angle alignment so the orange divider line and image edge share the exact same diagonal angle, placing the orange divider line directly on the point where the image begins.

## [1.2.15] - 2026-08-06

### Added
- Added `Display description` configuration switch setting to **Subcategory Carousel** and **Subcategory Grid** CMS elements in Administration and Storefront views.
- Added intelligent paragraph concatenation for multi-paragraph category descriptions in PHP resolvers (`SubcategoryCarouselCmsElementResolver` and `SubcategoryGridCmsElementResolver`), appending missing sentence punctuation and separating paragraphs with proper spacing.

### Fixed
- Fixed subcategory sort order in **Subcategory Carousel** (`subcategory-carousel`) and **Subcategory Grid** (`subcategory-grid`) CMS elements to strictly respect the position defined in the category tree (`afterCategoryId`) for both single and multi-level subcategory configurations.

## [1.2.14] - 2026-08-06

### Fixed
- Fixed missing Storefront block template (`cms-block-custom-code.html.twig`) for **Custom Code** block.
- Fixed code editor field labels and titles in Administration CMS layout editor configuration modal for **Custom Code** element (`cms-element-custom-code`).
- Fixed reactive data binding in Administration config component by calling `this.onChange()` on computed setters.
- Fixed snippet namespaces for element registration labels in English, German, and Dutch.

## [1.2.13] - 2026-08-06

### Added
- Added vertical alignment configuration option (Top, Middle, Bottom) for the **Button** CMS element (`cms-element-button`).
- Added vertical alignment flexbox CSS classes in Administration layout editor component and Storefront layout styles.
- Added English, German, and Dutch snippet translations for vertical alignment setting.

## [1.2.12] - 2026-08-05

### Added
- Added new **Flexible Image and Text** CMS block and element (`cms-element-flexible-image-text` / `cms-block-flexible-image-text`).
- Added support for rich text editor content (`sw-text-editor`), media library image uploads (`sw-media-compact-upload-v2`), photo/polaroid caption input, and responsive image thumbnail rendering (`sw_thumbnails`).
- Added layout position setting: **Image Left + Text Right** vs **Text Left + Image Right** (with automatic mobile stacking ensuring the image always stays on top).
- Added customizable column proportions: **25% - 75%**, **33% - 66%**, **50% - 50%**, **66% - 33%**, and **75% - 25%**.
- Added entrance animations: **Slide in (from left/right)**, **Fade in**, and **Zoom in** powered by a Storefront `IntersectionObserver` plugin.
- Added 5 presentation themes: **Traditional**, **Polaroid** (framed photo card with drop-shadow, tilt angle, and caption), **Offset** (overlapping frame), **Rounded** (dashed container with pill-rounded image), and **Stacked** (vertical full-width banner & content card).

## [1.2.11] - 2026-08-05


### Added
- Added new **Icon List** CMS block and element (`cms-element-icon-list` / `cms-block-icon-list`).
- Added support for standard Shopware SVG icons, custom icon CSS classes (`<i>` tag support for custom icon libraries like FontAwesome or Bootstrap Icons), and no-icon mode.
- Added **Horizontal List** (centered auto-fit grid presentation) and **Vertical List** (stacked row presentation with left-aligned icons) layout modes.
- Added display animations (**Insert one by one (fade)**, **Insert one by one (sliding in from right)**, **Insert one by one (sliding in from left)**) with Storefront `IntersectionObserver` triggers and staggered transitions.
- Added item reordering controls (Move Up / Move Down) and optional URL link configuration per item.

## [1.2.10] - 2026-08-05

### Fixed
- Refactored CTA element button styling in Storefront and Administration to rely completely on theme button styles (`btn`, `btn-primary`, `btn-secondary`, etc.).
- Fixed background image loading and rendering in Administration layout editor previews by fetching media entities asynchronously when media IDs are present.
- Fixed overlay stacking (`z-index`) and container rendering for CTA background images in Administration editor component.

## [1.2.9] - 2026-08-05

### Added
- Added individual button design / variant selection for Primary and Secondary buttons in CTA block (`primary`, `secondary`, `outline-primary`, `outline-secondary`, `light`, `dark`, `link`).
- Added Layout Structure choices for CTA block: `Vertical (Buttons side-by-side)`, `Vertical (Buttons stacked)`, and `Horizontal (Content left, buttons right)`.
- Updated Administration configuration panel and Storefront SCSS/Twig layout templates to support responsive orientation switching and dynamic button variants.

## [1.2.8] - 2026-08-05

### Added
- Added new **Button** CMS block and element (`cms-element-button` / `cms-block-button`).
- Added button variant selection: Primary (`btn-primary`), Secondary (`btn-secondary`), Outline Primary (`btn-outline-primary`), Outline Secondary (`btn-outline-secondary`), and Link (`btn-link`).
- Added width configuration: Content Width (`auto`) vs Full Width (`100%`).
- Added alignment setting (Left, Center, Right) for content-width buttons.
- Integrated Shopware icon selector for optional icons before and/or after the button label.
- Added link configuration options (URL, Target `_self`/`_blank`, and Title/Aria-label for accessibility).

## [1.2.7] - 2026-08-05

### Added
- Added extra item properties to `Custom Carousel`: item date, show start date, show end date, category text, and category pill style (`primary`, `secondary`, `tertiary`).
- Added drag-and-drop reordering as well as up/down movement controls for carousel items in the Administration configuration panel.
- Added 5 themes for custom carousel: `Classic` (card with shadow), `Minimal` (clean background with no border or shadow), `Category` (category accent), `Horizontal` (horizontal split card layout), and `Media` (overlay title with readability drop-shadow).
- Added `Number of items to display` setting (`itemsToDisplay`) to cap displayed active items while permitting generic fallback items.
- Added `Highlight active item` setting to enlarge the active visible card with the primary brand border color.
- Updated Administration layout editor component to display the first 3 items in the preview grid reflecting the selected theme.

## [1.2.6] - 2026-07-26

### Added
- Added new **Statistics** CMS block and element to display animated stats grids.
- Added 3 distinct presentation themes: **Clean Design** (columns without borders/background), **Boxed Design** (card with subtle gradient background and item dividers), and **Clean Divided** (column grid with subtle dividers).
- Integrated Shopware icon selector dropdown for statistic items.
- Added smart count-up number animation in Storefront using `IntersectionObserver` that dynamically parses numbers, currencies, decimals, and suffixes.
- Added configurable intro text section.

## [1.2.5] - 2026-07-26

### Fixed
- Refactored SCSS stylesheets for Category Header CMS block & element, eliminating all `!important` flags in favor of strict selector hierarchy.
- Pixel-matched all 5 Category Header design styles to Figma specifications with pure semantic `h1` and `p` typography inheriting from environment font configuration.

## [1.2.4] - 2026-07-26

### Added
- Added Category Header CMS block and element displaying current category title, subtitle, description, and media image.
- Implemented 5 distinct design styles (Minimal Card, Accent Frame, Dark Overlay, Circle Frame, and Diagonal Split) with selection in block/element configuration.
- Added `ultimate_cms_tools_subtitle` custom field to categories for rendering category subtitles.

## [1.2.3] - 2026-07-26

### Added
- Added "Display on mobile device" setting (1 column vs 2 columns) to Manufacturer Grid and Subcategory Grid CMS elements.
- Updated storefront grid templates and SCSS layouts to support responsive 2-column mobile presentation.

## [1.2.2] - 2026-07-26

### Added
- Added display settings for Logo (image), Title, and Description to Manufacturer Grid and Manufacturer Carousel CMS elements.
- Enabled all display options by default with full administration switch fields and storefront template conditions.

## [1.2.1] - 2026-07-26

### Added
- Implemented endless infinite rotation for all card carousel CMS elements (`subcategory-carousel`, `manufacturer-carousel`, `custom-carousel`, `custom-product-carousel`).
- Seamless card cloning and wrap-around detection preventing reverse scrolling when reaching the last card.
- Synchronized active dot index calculation on loop wrap-around so dot 0 highlights when returning to the first card.

## [1.2.0] - 2026-07-26

### Added
- Standardized configuration settings across all carousel CMS elements (`common-slider`, `custom-carousel`, `custom-product-carousel`, `manufacturer-carousel`, `subcategory-carousel`): Show Navigation Arrows, Show Navigation Dots, Dots position (Inside/Outside), Autoplay, Autoplay speed (ms), and Max-height (px).
- Centralized SCSS for navigation arrows, dots, and height adaptiveness in a shared stylesheet `_carousel-shared.scss`.

## [1.1.1] - 2026-07-23

### Added
- Added minimum height configuration option (`minHeight`) to the CTA CMS element & block, ensuring essential background images remain visible.
- Added English, German, and Dutch translations for the minimum height CTA setting.

## [1.1.0] - 2026-07-22

### Added
- Added Manufacturer Grid and Manufacturer Carousel CMS blocks and elements.
- Added custom field set for Manufacturers (`Show in Grid` and `Show in Carousel`).
- Added non-cropped, centered logo presentation styling for manufacturers.
- Added smart internal vs. external URL target detection for manufacturer links.

## [1.0.4] - 2026-07-09

### Added
- Added 'Display image' setting switch to Subcategory Carousel and Subcategory Grid CMS elements configuration.
- Added Dutch and German translations for the 'Display image' setting.

## [1.0.3] - 2026-07-08

### Added
- Added category and subcategory filtering options to the Custom Product Carousel CMS element configuration when "Latest" or "Sale" selection type is selected.
- Added Dutch and German snippet translations for category filter labels and placeholders.

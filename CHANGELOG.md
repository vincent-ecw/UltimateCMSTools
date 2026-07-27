# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

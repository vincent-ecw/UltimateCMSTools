# Ultimate CMS Tools

A collection of CMS blocks and elements that enhance Shopware's Shopping Experiences with features that are essential for modern e-commerce page building.

## Table of Contents
- [Installation](#installation)
- [Available CMS Blocks](#available-cms-blocks)
  - [1. Common Slider](#1-common-slider)
  - [2. Subcategory Carousel](#2-subcategory-carousel)
  - [3. Subcategory Grid](#3-subcategory-grid)
  - [4. FAQ Harmonica](#4-faq-harmonica)
  - [5. Custom Code Block](#5-custom-code-block)
  - [6. Custom Carousel](#6-custom-carousel)
  - [7. Custom Product Carousel](#7-custom-product-carousel)
  - [8. Responsive Image](#8-responsive-image)
  - [9. Call to Action (CTA)](#9-call-to-action-cta)
  - [10. Magazine Quote](#10-magazine-quote)
  - [11. Image and Text Quartet](#11-image-and-text-quartet)
- [Development and Compilation](#development-and-compilation)

---

## Installation

To install and activate the plugin within the Docker environment:

```bash
# Refresh the plugin list
docker exec -it sw67adev bin/console plugin:refresh

# Install and activate the plugin
docker exec -it sw67adev bin/console plugin:install --activate UltimateCmsTools

# Clear the cache
docker exec -it sw67adev bin/console cache:clear
```

---

## Available CMS Blocks

All blocks registered by this plugin are grouped under the custom block category **Ultimate CMS Tools** in the CMS editor.

### 1. Common Slider

A fully responsive, highly configurable image and banner slider. It allows you to specify different media assets for Desktop, Tablet, and Mobile devices to optimize page performance and layout across all breakpoints.

* **Block Name:** `common-slider`
* **Element Name:** `common-slider`

#### Configuration Options

The configuration modal is split into two tabs:

##### Content Tab
Allows you to add, remove, and manage individual slides. For each slide, you can configure:
* **Desktop Image (`mediaIdDesktop`):** The image displayed on viewport widths >= 992px.
* **Tablet Image (`mediaIdTablet`):** The image displayed on viewport widths >= 768px and < 992px.
* **Mobile Image (`mediaIdMobile`):** The image displayed on viewport widths < 768px.
* **Title (Optional):** Heading text displayed as an overlay on the slide.
* **Button Text (Optional):** Label for the Call-to-Action (CTA) button overlay.
* **Button URL (Optional):** Destination link for the CTA button.
* **Button Target:** Opens the link in the same window (`_self`) or in a new tab/window (`_blank`).

##### Settings Tab
Global settings that apply to the entire slider:
* **Show Navigation Arrows (`navigationArrows`):** Toggles the left and right navigation arrows.
* **Show Navigation Dots (`navigationDots`):** Toggles the pagination dots at the bottom.
* **Dots Position (`navigationDotsPosition`):** Positions the dots inside the slider area (`inside`) or below the slider (`outside`). (Only active if dots are enabled).
* **Slider Effect (`effect`):** Transition effect between slides:
  * `Slide`: Standard horizontal slide transition.
  * `Fade`: Cross-fade transition.
  * `Surprise (Zoom Out)`: A zoom-out transition.
* **Autoplay Speed (ms) (`autoplaySpeed`):** Time in milliseconds each slide stays visible (e.g., `5000` = 5 seconds). Set to `0` to disable autoplay.
* **Max Height (px) (`maxHeight`):** Limit the height of the slider to a maximum value in pixels (e.g., `500`). When configured, images are scaled and centered (horizontally and vertically) using `object-fit: cover`. Leave empty to let the slider height auto-adapt to the image height.

---

### 2. Subcategory Carousel

A carousel displaying the subcategories of the active category. It is ideal for category landing pages and product list pages to guide customers deeper into the catalog.

* **Block Name:** `subcategory-carousel`
* **Element Name:** `subcategory-carousel`

#### Configuration Options

* **Show all subcategories (`showAllSubcategories`):**
  * **Disabled (default):** Fetches only the direct children (immediate subcategories) of the active category.
  * **Enabled:** Recursively fetches all descendant subcategories deep down the catalog tree by matching the active category ID within the category path.
* **Display image (`displayImage` - default enabled):** Toggles rendering of the category image/placeholder on each carousel card. When disabled, only the title and description are shown.
* *Note: This element automatically resolves the subcategory structure in the backend using a custom CMS element data resolver and displays the category image/placeholder, title, and a truncated description.*

---

### 3. Subcategory Grid

A responsive grid that displays the subcategories of the active category. It shares the same data resolver and configuration as the Subcategory Carousel, but renders the subcategories as a wrapping grid layout instead of a horizontally scrolling carousel. It is well suited for category landing pages where all subcategories should be visible at once.

* **Block Name:** `subcategory-grid`
* **Element Name:** `subcategory-grid`

#### Configuration Options

* **Show all subcategories (`showAllSubcategories`):**
  * **Disabled (default):** Fetches only the direct children (immediate subcategories) of the active category.
  * **Enabled:** Recursively fetches all descendant subcategories deep down the catalog tree by matching the active category ID within the category path.
* **Display image (`displayImage` - default enabled):** Toggles rendering of the category image/placeholder on each grid card. When disabled, only the title and description are shown.
* *Note: This element automatically resolves the subcategory structure in the backend using a custom CMS element data resolver and displays the category image/placeholder, title, and a truncated description.*

---

### 4. FAQ Harmonica

A collapsible Bootstrap accordion designed for Frequently Asked Questions (FAQs). It features support for custom uploaded image icons or built-in Shopware vector icons.

* **Block Name:** `faq-harmonica`
* **Element Name:** `faq-harmonica`

#### Configuration Options

Manage a dynamic list of collapsible FAQ items. For each item:
* **Icon (`mediaId` / `icon`):** Upload an image file (recommended size: exactly `24x24 px` for optimal alignment) or input a standard Shopware icon name (e.g., `regular-comments` or `regular-question-circle-s`).
* **Question (`title`):** The text displayed on the header button of the accordion item.
* **Answer (`content`):** A rich-text area (utilizing the built-in `sw-text-editor`) containing the body of the answer.

---

### 5. Custom Code Block

An advanced layout tool enabling developers and administrators to inject custom, inline CSS and JavaScript directly into a specific CMS page.

* **Block Name:** `custom-code`
* **Element Name:** `custom-code`

#### Configuration Options

Contains two code editors powered by the Shopware admin code component:
* **CSS Code (`cssCode`):** An editor with CSS syntax highlighting. Code is automatically wrapped inside storefront `<style>` tags.
* **JavaScript Code (`jsCode`):** An editor with JavaScript syntax highlighting. Code is automatically wrapped inside storefront `<script>` tags.
* *Note: Input sanitization is bypassed for these fields to prevent custom scripts and styles from being stripped out by the administration framework.*

---

### 6. Custom Carousel

A fully custom carousel that matches the look and feel of the subcategories carousel, allowing website managers to manually configure individual slides.

* **Block Name:** `custom-carousel`
* **Element Name:** `custom-carousel`

#### Configuration Options

Manage a dynamic list of carousel items. For each item:
* **Title (`title` - Mandatory):** Heading text for the item card.
* **Description (`description` - Optional):** Multi-line text block shown on the item card.
* **Image (`mediaId` - Optional):** Upload an image file or choose one from the media manager.
* **Button Text (`buttonText` - Optional):** Text label for the CTA button on the card.
* **Button URL (`buttonUrl` - Optional):** Destination URL link for the button or entire card (if no button text is defined).
* **Button Target (`buttonTarget` - Optional):** Opens the URL in the same window (`_self`) or in a new tab/window (`_blank`).

---

### 7. Custom Product Carousel

A product carousel that displays store products using several selection strategies, with full carousel navigation and autoplay controls. It reuses the same slider look and feel as the other carousels in this plugin.

* **Block Name:** `custom-product-carousel`
* **Element Name:** `custom-product-carousel`

#### Configuration Options

The configuration modal is split into two tabs:

##### Content Tab
* **Product Selection (`productSelectionType` - default `manual`):** Determines how products are collected:
  * `Manual Selection`: Hand-pick individual products via a product multi-select (`products`).
  * `Dynamic Product Group`: Populate the carousel from a dynamic product group / product stream (`productStreamId`).
  * `Latest Products (by Date)`: Automatically show the most recently added products.
  * `Sale Products`: Automatically show products that are on sale.
* **Category Filter (`categoryId` - Optional):** When using the `Latest` or `Sale` selection types, limits the products to a chosen category.
* **Also look in subcategories (`includeSubcategories` - Optional):** When a category filter is set, also includes products from its subcategories.
* **Show amount of products (`limit` - default `10`):** Maximum number of products rendered in the carousel.

##### Settings Tab
* **Show Navigation Arrows (`navigationArrows` - default enabled):** Toggles the left and right navigation arrows.
* **Show Navigation Dots (`navigationDots` - default enabled):** Toggles the pagination dots.
* **Dots Position (`navigationDotsPosition` - default `inside`):** Positions the dots inside (`inside`) or below (`outside`) the slider area.
* **Autoplay (`autoplay` - default enabled):** Enables automatic advancing of slides.
* **Autoplay Speed (ms) (`autoplaySpeed` - default `5000`):** Time in milliseconds each slide stays visible. Set to `0` to disable autoplay.
* **Max Height (px) (`maxHeight` - Optional):** Limits the height of the slider to a maximum value in pixels. Leave empty to auto-adapt.

---

### 8. Responsive Image

A CMS element providing high-performance responsive image rendering using a semantic HTML5 `<picture>` tag. It allows target-specific image assets to be selected for desktop, tablet, and mobile viewport sizes to ensure fast page loads and correct aspect ratios.

* **Block Name:** `responsive-image`
* **Element Name:** `responsive-image`

#### Configuration Options

* **Desktop Image (`mediaDesktop` - Mandatory):** The fallback image and source displayed on desktop viewports.
* **Tablet Image (`mediaTablet` - Optional):** Custom source displayed on tablet viewports (up to 767px wide).
* **Mobile Image (`mediaMobile` - Optional):** Custom source displayed on mobile viewports (up to 576px wide).
* **Alt Text (`altText` - Optional):** Alternative text description for accessibility and SEO. If empty, falls back to the default Shopware media manager alternative text.
* **Link URL (`linkUrl` - Optional):** Makes the entire image clickable, redirecting to this URL.
* **Link Target (`linkTarget` - Optional):** Sets whether to open the URL in the same tab (`_self`) or in a new window (`_blank`).

---

### 9. Call to Action (CTA)

A highly flexible Call to Action banner card designed to capture user engagement. It supports rich typography, secondary styling buttons, and background images with modern, interactive style presets.

* **Block Name:** `cta`
* **Element Name:** `cta`

#### Configuration Options

* **Title (`title` - Optional):** Large header text.
* **Subtitle (`subtitle` - Optional):** Multi-line secondary description.
* **Primary Button Text (`buttonText` - Optional):** Label for the primary action button.
* **Primary Button URL (`buttonUrl` - Optional):** URL destination for the primary action.
* **Primary Button Target (`buttonTarget` - Optional):** Target window context (`_self` or `_blank`) for the primary button.
* **Secondary Button Text (`buttonSecondaryText` - Optional):** Label for the optional secondary action button.
* **Secondary Button URL (`buttonSecondaryUrl` - Optional):** URL destination for the secondary action.
* **Secondary Button Target (`buttonSecondaryTarget` - Optional):** Target window context (`_self` or `_blank`) for the secondary button.
* **Background Image (`backgroundImage` - Optional):** Image mapped behind the text content of the card. When configured, a subtle overlay is rendered automatically to ensure text readability.
* **Style Preset (`style` - Optional):** Sets the visual style, layout and hover effects of the CTA block. Options:
  * `split-minimal`: Sleek minimal design with side-by-side or split visual distribution.
  * `neo-brutal`: Neo-brutalism design style with high contrast, thick black borders, and offset shadows.
  * `glassmorphic`: Translucent backdrop-filter card overlays that blend with the background image.
  * `hero-spotlight`: Highlighted center-stage hero design.
  * `interactive-card`: A structured card with enhanced interactive mouse-hover transitions.
* **Text Color (`textColor` - Optional):** Toggles between `dark` and `light` text rendering modes to optimize visibility.

---

### 10. Magazine Quote

A dedicated layout component designed for editorial blocks, magazine articles, or quotes. It allows highlighting significant quotes alongside optional author profiles and stylized typography.

* **Block Name:** `magazine-quote`
* **Element Name:** `magazine-quote`

#### Configuration Options

* **Quote (`quote` - Mandatory):** The body of the quotation.
* **Author Name (`authorName` - Optional):** The name of the quoted author.
* **Author Profile Image (`authorImage` - Optional):** An uploadable profile avatar displayed in a circular wrapper next to or below the quote.
* **Style Preset (`style` - Optional):** Choice of 5 visual theme presets styled for distinct brand feels:
  * `provia`: Standard, highly clean editor style.
  * `velvia`: Dynamic, high-saturation color theme.
  * `classic-chrome`: Understated retro-modern style.
  * `astia`: Soft, elegant tone design.
  * `acros`: High contrast monochrome layout.

---

### 11. Image and Text Quartet

A structured element displaying content in two distinct rows, alternating image and text blocks for a balanced layout. It features deep responsive image customization per breakpoint, custom ratios, and built-in mobile layout optimization.

* **Block Name:** `image-text-quartet`
* **Element Name:** `image-text-quartet`

#### Configuration Options

For both Row 1 and Row 2, the following fields are independently configurable:
* **Desktop Image (`media1Desktop` / `media2Desktop` - Mandatory):** The main desktop image file.
* **Tablet Image (`media1Tablet` / `media2Tablet` - Optional):** Specific image asset to use for tablet viewports.
* **Mobile Image (`media1Mobile` / `media2Mobile` - Optional):** Specific image asset to use for mobile viewports.
* **Alt Text (`altText1` / `altText2` - Optional):** Alternative text description for the row's image.
* **Text (`text1` / `text2` - Optional):** HTML/Rich-text description rendered using the built-in WYSIWYG editor.
* **Column Ratio (`ratio1` / `ratio2` - Optional):** Determines the width split percentage between the Image and Text columns:
  * `50-50`: Balanced equal columns.
  * `70-30`: Wider image column (70%) and narrower text column (30%).
  * `30-70`: Narrower image column (30%) and wider text column (70%).

---

## Development and Compilation

If you modify the administration interface (Vue/Vite) or the storefront scripts/styles:

### Build Administration (Vue 3 / Vite)
```bash
docker exec -it sw67adev ./bin/build-administration.sh
```

### Build Storefront (JS & SCSS)
```bash
docker exec -it sw67adev ./bin/build-storefront.sh
```

### Compile Theme & Clear Cache
```bash
docker exec -it sw67adev bin/console theme:compile
docker exec -it sw67adev bin/console cache:clear
```

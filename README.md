# Ultimate CMS Tools

A collection of CMS blocks and elements that enhance Shopware's Shopping Experiences with features that are essential for modern e-commerce page building.

## Table of Contents
- [Installation](#installation)
- [Available CMS Blocks](#available-cms-blocks)
  - [1. Common Slider](#1-common-slider)
  - [2. Subcategory Carousel](#2-subcategory-carousel)
  - [3. FAQ Harmonica](#3-faq-harmonica)
  - [4. Custom Code Block](#4-custom-code-block)
  - [5. Custom Carousel](#5-custom-carousel)
  - [6. Responsive Image](#6-responsive-image)
  - [7. Call to Action (CTA)](#7-call-to-action-cta)
  - [8. Magazine Quote](#8-magazine-quote)
  - [9. Image and Text Quartet](#9-image-and-text-quartet)
  - [10. Subcategory Grid](#10-subcategory-grid)
  - [11. Manufacturer Grid](#11-manufacturer-grid)
  - [12. Manufacturer Carousel](#12-manufacturer-carousel)
  - [13. Custom Product Carousel](#13-custom-product-carousel)
  - [14. Category Header](#14-category-header)
  - [15. Statistics](#15-statistics)
- [Development and Compilation](#development-and-compilation)

---

## Installation

### Option 1: Via Composer (Recommended)
Add the plugin dependency to your Shopware 6 project:

```bash
composer require vincentbourgonje/ultimate-cms-tools
bin/console plugin:refresh
bin/console plugin:install --activate UltimateCmsTools
bin/console cache:clear
```

### Option 2: Via GitHub Release Archive
1. Download the latest release `.zip` archive from [GitHub Releases](https://github.com/drunkenunicorn1972/ultimate-cms-tools/releases).
2. Extract the archive into your project's `custom/plugins/UltimateCmsTools` directory.
3. Run the standard Shopware CLI commands to register and activate the plugin:

```bash
bin/console plugin:refresh
bin/console plugin:install --activate UltimateCmsTools
bin/console cache:clear
```

---

## Available CMS Blocks

All blocks registered by this plugin are grouped under the custom block category **Ultimate CMS Tools** in the CMS layout editor.

> [!NOTE]
> All carousel elements (`Common Slider`, `Custom Carousel`, `Custom Product Carousel`, `Manufacturer Carousel`, `Subcategory Carousel`) share a standardized set of settings under their **Settings** tab:
> * **Show Navigation Arrows (`navigationArrows`):** Toggles navigation left/right arrows.
> * **Show Navigation Dots (`navigationDots`):** Toggles pagination dots.
> * **Dots Position (`navigationDotsPosition`):** `Inside` (overlay over slider bottom) or `Outside` (positioned below slider).
> * **Autoplay (`autoplay`):** Enables automatic slide cycling.
> * **Autoplay Speed (`autoplaySpeed`):** Time in ms per slide (e.g. 5000 = 5s).
> * **Max Height (`maxHeight`):** Maximum height in pixels (e.g. 500). Images scale and adapt automatically without being cut off.

---

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
* **Dots Position (`navigationDotsPosition`):** Positions the dots inside the slider area (`inside`) or below the slider (`outside`).
* **Slider Effect (`effect`):** Transition effect between slides (`Slide`, `Fade`, `Surprise (Zoom Out)`).
* **Autoplay Speed (ms) (`autoplaySpeed`):** Time in milliseconds each slide stays visible (e.g., `5000` = 5 seconds).
* **Max Height (px) (`maxHeight`):** Limit the height of the slider to a maximum value in pixels (e.g., `500`).

---

### 2. Subcategory Carousel

A carousel displaying the subcategories of the active category. It is ideal for category landing pages and product list pages to guide customers deeper into the catalog.

* **Block Name:** `subcategory-carousel`
* **Element Name:** `subcategory-carousel`

#### Configuration Options

* **Show all subcategories (`showAllSubcategories`):**
  * **Disabled (default):** Fetches only the direct children (immediate subcategories) of the active category.
  * **Enabled:** Recursively fetches all descendant subcategories deep down the catalog tree.
* **Display image (`displayImage`):** Toggles category image visibility on item cards.
* Standard carousel settings (Arrows, Dots, Autoplay, Max-Height).

---

### 3. FAQ Harmonica

A collapsible Bootstrap accordion designed for Frequently Asked Questions (FAQs). It features support for custom uploaded image icons or built-in Shopware vector icons.

* **Block Name:** `faq-harmonica`
* **Element Name:** `faq-harmonica`

#### Configuration Options

Manage a dynamic list of collapsible FAQ items. For each item:
* **Icon (`mediaId` / `icon`):** Upload an image file (recommended size: `24x24 px`) or input a standard Shopware icon name (e.g., `regular-comments` or `regular-question-circle-s`).
* **Question (`title`):** The text displayed on the header button of the accordion item.
* **Answer (`content`):** A rich-text area (utilizing the built-in `sw-text-editor`) containing the body of the answer.

---

### 4. Custom Code Block

An advanced layout tool enabling developers and administrators to inject custom, inline CSS and JavaScript directly into a specific CMS page.

* **Block Name:** `custom-code`
* **Element Name:** `custom-code`

#### Configuration Options

Contains two code editors powered by the Shopware admin code component:
* **CSS Code (`cssCode`):** An editor with CSS syntax highlighting. Code is automatically wrapped inside storefront `<style>` tags.
* **JavaScript Code (`jsCode`):** An editor with JavaScript syntax highlighting. Code is automatically wrapped inside storefront `<script>` tags.

---

### 5. Custom Carousel

A fully custom carousel that matches the look and feel of the subcategories carousel, allowing website managers to manually configure individual slides.

* **Block Name:** `custom-carousel`
* **Element Name:** `custom-carousel`

#### Configuration Options

Manage a dynamic list of carousel items. For each item:
* **Title (`title` - Mandatory):** Heading text for the item card.
* **Description (`description` - Optional):** Multi-line text block shown on the item card.
* **Image (`mediaId` - Optional):** Upload an image file or choose one from the media manager.
* **Button Text (`buttonText` - Optional):** Text label for the CTA button on the card.
* **Button URL (`buttonUrl` - Optional):** Destination URL link for the button or entire card.
* **Button Target (`buttonTarget` - Optional):** Opens the URL in the same window (`_self`) or in a new tab/window (`_blank`).
* Standard carousel settings (Arrows, Dots, Autoplay, Max-Height).

---

### 6. Responsive Image

A CMS element providing high-performance responsive image rendering using a semantic HTML5 `<picture>` tag. It allows target-specific image assets to be selected for desktop, tablet, and mobile viewport sizes.

* **Block Name:** `responsive-image`
* **Element Name:** `responsive-image`

#### Configuration Options

* **Desktop Image (`mediaDesktop` - Mandatory):** The fallback image and source displayed on desktop viewports.
* **Tablet Image (`mediaTablet` - Optional):** Custom source displayed on tablet viewports (up to 767px wide).
* **Mobile Image (`mediaMobile` - Optional):** Custom source displayed on mobile viewports (up to 576px wide).
* **Alt Text (`altText` - Optional):** Alternative text description for accessibility and SEO.
* **Link URL (`linkUrl` - Optional):** Makes the entire image clickable, redirecting to this URL.
* **Link Target (`linkTarget` - Optional):** Sets whether to open the URL in the same tab (`_self`) or in a new window (`_blank`).

---

### 7. Call to Action (CTA)

A highly flexible Call to Action banner card designed to capture user engagement. It supports rich typography, secondary styling buttons, and background images with modern, interactive style presets.

* **Block Name:** `cta`
* **Element Name:** `cta`

#### Configuration Options

* **Title (`title` - Optional):** Large header text.
* **Subtitle (`subtitle` - Optional):** Multi-line secondary description.
* **Primary Button Text (`buttonText` - Optional):** Label for the primary action button.
* **Primary Button URL (`buttonUrl` - Optional):** URL destination for the primary action.
* **Primary Button Target (`buttonTarget` - Optional):** Target window context (`_self` or `_blank`).
* **Secondary Button Text (`buttonSecondaryText` - Optional):** Label for the optional secondary action button.
* **Secondary Button URL (`buttonSecondaryUrl` - Optional):** URL destination for the secondary action.
* **Secondary Button Target (`buttonSecondaryTarget` - Optional):** Target window context (`_self` or `_blank`).
* **Background Image (`backgroundImage` - Optional):** Image mapped behind the text content of the card.
* **Minimum Height (`minHeight` - Optional):** Sets a minimum height (e.g. `400px` or `400`) for the CTA block.
* **Style Preset (`style` - Optional):** `split-minimal`, `neo-brutal`, `glassmorphic`, `hero-spotlight`, `interactive-card`.
* **Text Color (`textColor` - Optional):** Toggles between `dark` and `light` text rendering modes.

---

### 8. Magazine Quote

A dedicated layout component designed for editorial blocks, magazine articles, or quotes. It allows highlighting significant quotes alongside optional author profiles and stylized typography.

* **Block Name:** `magazine-quote`
* **Element Name:** `magazine-quote`

#### Configuration Options

* **Quote (`quote` - Mandatory):** The body of the quotation.
* **Author Name (`authorName` - Optional):** The name of the quoted author.
* **Author Profile Image (`authorImage` - Optional):** Profile avatar displayed in a circular wrapper next to or below the quote.
* **Style Preset (`style` - Optional):** `provia`, `velvia`, `classic-chrome`, `astia`, `acros`.

---

### 9. Image and Text Quartet

A structured element displaying content in two distinct rows, alternating image and text blocks for a balanced layout. It features deep responsive image customization per breakpoint, custom ratios, and built-in mobile layout optimization.

* **Block Name:** `image-text-quartet`
* **Element Name:** `image-text-quartet`

#### Configuration Options

For both Row 1 and Row 2:
* **Desktop Image (`media1Desktop` / `media2Desktop` - Mandatory):** Main desktop image.
* **Tablet Image (`media1Tablet` / `media2Tablet` - Optional):** Specific image asset for tablet viewports.
* **Mobile Image (`media1Mobile` / `media2Mobile` - Optional):** Specific image asset for mobile viewports.
* **Alt Text (`altText1` / `altText2` - Optional):** Alternative text description.
* **Text (`text1` / `text2` - Optional):** HTML/Rich-text description rendered using the built-in WYSIWYG editor.
* **Column Ratio (`ratio1` / `ratio2` - Optional):** `50-50`, `70-30`, or `30-70`.

---

### 10. Subcategory Grid

Displays the subcategories of the active category in a responsive grid layout.

* **Block Name:** `subcategory-grid`
* **Element Name:** `subcategory-grid`

#### Configuration Options

* **Show all subcategories (`showAllSubcategories`):** Toggles fetching immediate children vs deep descendant subcategories.
* **Display image (`displayImage`):** Toggles category image visibility.
* **Display on mobile device (`columnsMobile`):** Choice of `1 column` (default) or `2 columns` layout presentation on mobile viewports.

---

### 11. Manufacturer Grid

Displays brand manufacturers in a clean responsive grid layout.

* **Block Name:** `manufacturer-grid`
* **Element Name:** `manufacturer-grid`

#### Configuration Options

* **Display logo (`displayLogo`):** Toggles manufacturer logo image visibility.
* **Display title (`displayTitle`):** Toggles manufacturer name title visibility.
* **Display description (`displayDescription`):** Toggles manufacturer description visibility.
* **Display on mobile device (`columnsMobile`):** Choice of `1 column` (default) or `2 columns` layout presentation on mobile viewports.

---

### 12. Manufacturer Carousel

A carousel displaying brand manufacturers with configurable display toggles.

* **Block Name:** `manufacturer-carousel`
* **Element Name:** `manufacturer-carousel`

#### Configuration Options

* **Display logo (`displayLogo`):** Toggles manufacturer logo image visibility.
* **Display title (`displayTitle`):** Toggles manufacturer name title visibility.
* **Display description (`displayDescription`):** Toggles manufacturer description visibility.
* Standard carousel settings (Arrows, Dots, Autoplay, Max-Height).

---

### 13. Custom Product Carousel

A product carousel displaying dynamic or manually selected product cards.

* **Block Name:** `custom-product-carousel`
* **Element Name:** `custom-product-carousel`

#### Configuration Options

* **Product Selection Type (`productsType`):** `Manual` selection, `Latest` products, `Sale` items, or `Top Sellers`.
* **Category Filter (`categoryId` - Optional):** Filters latest or sale product selections to specific category branches.
* **Max Products (`maxProducts`):** Maximum number of product items to fetch and display.
* Standard carousel settings (Arrows, Dots, Autoplay, Max-Height).

---

### 14. Category Header

Displays the active category's header section with title, subtitle, description, and image, styled across 5 distinct visual designs.

* **Block Name:** `category-header`
* **Element Name:** `category-header`

#### Configuration Options

* **Design Style (`design`):** Choice of 5 visual layouts:
  * `design-1`: Minimal Card (Soft blue-gray rounded card with right image).
  * `design-2`: Accent Frame (White card with amber subtitle badge and rotated image frame).
  * `design-3`: Dark Overlay (Dark navy hero banner with background image and gradient overlay).
  * `design-4`: Circle Frame (Light container with horizontal accent line subtitle and double-ring circular image).
  * `design-5`: Diagonal Split (Angled dark navy section with gold divider line and right-side clipped image).
* **Title Override (`title` - Optional):** Custom title overriding category name / `Page title` custom field.
* **Subtitle Override (`subtitle` - Optional):** Custom subtitle overriding category `Subtitle` custom field.
* **Description Override (`description` - Optional):** Custom description overriding category description.
* **Image Override (`media` - Optional):** Custom image overriding category media asset.

---

### 15. Statistics

Displays an animated statistics grid featuring custom icons, titles, numbers with count-up animation, sublines, and optional intro text.

* **Block Name:** `statistics`
* **Element Name:** `statistics`

#### Configuration Options

* **Theme Variations (`theme`):** Choice of 3 presentation styles:
  * `clean`: Clean design with columns, bold typography, no border or background.
  * `boxed`: Boxed design with gradient card background, rounded corners, soft shadow, and item dividers.
  * `clean-divided`: Clean design with subtle vertical dividers between elements.
* **Intro Text (`introText` - Optional):** Paragraph / headline text displayed above the statistics grid.
* **Desktop Columns (`columns`):** Choice of 2, 3, or 4 grid columns.
* **Item Repeater (`items`):** Content manager can add, remove, and configure statistic items:
  * **Icon (`icon`):** Selectable from Shopware icon dropdown picker.
  * **Title (`title`):** Label or statistic title.
  * **Number Value (`number`):** Formatted numeric value (e.g. `99.95%`, `2,000+`, `$55M+`, `85%`).
  * **Subline (`subline`):** Explanatory text under the number.

---

## Development and Compilation

If you modify administration components (Vue 3 / Vite) or storefront scripts/styles:

### Build Administration
```bash
./bin/build-administration.sh
```

### Build Storefront
```bash
./bin/build-storefront.sh
```

### Compile Theme & Clear Cache
```bash
bin/console theme:compile
bin/console cache:clear
```

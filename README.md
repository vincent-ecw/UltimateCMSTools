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
  - [16. Button](#16-button)
  - [17. Icon List](#17-icon-list)
  - [18. Flexible Image and Text](#18-flexible-image-and-text)
  - [19. Harmonica List](#19-harmonica-list)
- [Design Token Color System](#design-token-color-system)
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

A collapsible Bootstrap accordion designed for Frequently Asked Questions (FAQs). It features automated Schema.org `FAQPage` rich snippets (JSON-LD structured data) for SEO indexing, support for custom uploaded image icons, built-in Shopware vector icons, and 5 dynamic theme variations that adapt seamlessly to active Shopware theme colors (`$primary`, `$secondary`, `$tertiary`).

* **Block Name:** `faq-harmonica`
* **Element Name:** `faq-harmonica`
* **Rich Snippets:** Outputs Schema.org JSON-LD `<script type="application/ld+json">` (`@type: FAQPage`, `@type: Question`, `@type: Answer`) automatically.

#### Configuration Options

The configuration modal features two tabs:

##### Content Tab
Manage a dynamic list of collapsible FAQ items. For each item:
* **Icon (`mediaId` / `icon`):** Upload an image file (recommended size: `24x24 px`) or input a standard Shopware icon name (e.g., `regular-comments` or `regular-question-circle-s`).
* **Question (`title`):** The text displayed on the header button of the accordion item.
* **Answer (`content`):** A rich-text area (utilizing the built-in `sw-text-editor`) containing the body of the answer.

##### Settings Tab
* **Accordion Theme (`theme`):** Choose from 5 distinct visual styles:
  * **Minimal Clean Dividers (`clean`):** Sleek minimal list layout with hairline horizontal dividers.
  * **Floating Cards (`boxed`):** Floating card boxes with rounded corners, subtle drop shadows, and active primary border outlines.
  * **Accent Toggle Block (`pill-block`):** Elementor-inspired side block button featuring solid `$primary` or `$secondary` badge toggles (`+` / `-`).
  * **Modern Numbered (`editorial-numbered`):** High-impact editorial design with auto-formatted item numbers (`01`, `02`...), diagonal arrow toggles (`↗`), and solid color background row fills when active.
  * **Left Accent Border (`accent-line`):** Clean card rows highlighted with a bold 4px vertical accent bar on the left edge when expanded.

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

Manage a dynamic list of carousel items with drag-and-drop reordering. For each item:
* **Title (`title` - Mandatory):** Heading text for the item card.
* **Description (`description` - Optional):** Multi-line text block shown on the item card.
* **Category (`category` - Optional):** Text tag displayed as a pill badge (`Primary`, `Secondary`, or `Tertiary` style).
* **Item Date (`itemDate` - Optional):** Display date formatted according to storefront localization settings.
* **Show Start / End Date (`showStartDate` / `showEndDate` - Optional):** Time-sensitive visibility window for automated publishing and expiration.
* **Image (`mediaId` - Optional):** Upload an image file or choose one from the media manager (defaults to Shopware placeholder if omitted).
* **Button URL (`buttonUrl` - Optional):** Destination URL link for the card.
* **Button Target (`buttonTarget` - Optional):** Opens the URL in the same window (`_self`) or in a new tab/window (`_blank`).

#### Carousel Theme & Display Settings:
* **Carousel Theme (`theme`):** Select between 5 distinct design styles:
  1. `Classic`: Card layout with rounded corners and subtle shadow.
  2. `Minimal`: Clean background layout without borders or shadows.
  3. `Category`: Layout prioritizing category pill and date meta info.
  4. `Horizontal`: Side-by-side image and text layout on desktop viewports.
  5. `Media`: Image-focused overlay layout with title drop-shadow for high contrast readability.
* **Number of items to display (`itemsToDisplay`):** Caps the maximum visible active items (allowing generic fallback items to auto-fill as time-sensitive posts expire).
* **Highlight active item (`highlightActiveItem`):** Enlarges the active slide card with a 2px primary brand border.
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
* **Primary Button Design (`buttonVariant` - Optional):** Select button variant (`primary`, `secondary`, `outline-primary`, `outline-secondary`, `light`, `dark`, `link`). Relying on theme button styling.
* **Secondary Button Text (`buttonSecondaryText` - Optional):** Label for the optional secondary action button.
* **Secondary Button URL (`buttonSecondaryUrl` - Optional):** URL destination for the secondary action.
* **Secondary Button Target (`buttonSecondaryTarget` - Optional):** Target window context (`_self` or `_blank`).
* **Secondary Button Design (`buttonSecondaryVariant` - Optional):** Select button variant (`primary`, `secondary`, `outline-primary`, `outline-secondary`, `light`, `dark`, `link`). Relying on theme button styling.
* **Layout Structure (`layout` - Optional):**
  - `vertical-inline`: Title/subtitle top, buttons side-by-side below.
  - `vertical-stacked`: Title/subtitle top, buttons stacked vertically below.
  - `horizontal`: Title/subtitle on left side, buttons stacked on right side.
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

### 16. Button

Renders a theme-styled action button with flexible width, alignment, icon pickers (before/after), and link target options.

* **Block Name:** `button`
* **Element Name:** `button`

#### Configuration Options

* **Button Label (`title`):** Text displayed on the button.
* **Target Link URL (`linkUrl`):** Target URL destination.
* **Link Target (`linkTarget`):** Choice of Same Tab (`_self`) or New Tab (`_blank`).
* **Link Title / Tooltip (`linkTitle` - Optional):** Sets `title` and `aria-label` accessibility attributes.
* **Button Style (`variant`):** Choice of 5 theme button styles:
  * `primary`: Primary theme button (`btn-primary`).
  * `secondary`: Secondary theme button (`btn-secondary`).
  * `outline-primary`: Outline primary theme button (`btn-outline-primary`).
  * `outline-secondary`: Outline secondary theme button (`btn-outline-secondary`).
  * `link`: Text link style (`btn-link`).
* **Button Width (`width`):** Choice of Content Width (`auto`) or Full Width (`100%` / `w-100`).
* **Button Alignment (`alignment`):** Alignment when using Content Width (`left`, `center`, `right`).
* **Vertical Alignment (`verticalAlignment`):** Choice of Top (`top`), Middle (`center`), or Bottom (`bottom`) positioning within the slot container.
* **Icon Before Label (`iconBefore`):** Icon from dropdown picker displayed before text (or `none`).
* **Icon After Label (`iconAfter`):** Icon from dropdown picker displayed after text (or `none`).

---

### 17. Icon List

Renders a list of feature items with icons (standard Shopware icons, custom icon classes, or no icon), bold titles, and text descriptions in horizontal or vertical layouts with display animations.

* **Block Name:** `icon-list`
* **Element Name:** `icon-list`

#### Configuration Options

##### Content Tab
* **Item Repeater (`items`):** Add, remove, and reorder items with Move Up / Move Down controls. For each item:
  * **Icon (`icon`):** Select from Shopware icon dropdown, `No icon` (`none`), or `Enter icon class` (`custom`).
  * **Custom Icon Class (`customIconClass`):** Text field shown when `Enter icon class` is selected, inserting an `<i>` tag with specified classes (e.g. `fa-solid fa-rocket` or `bi bi-star`).
  * **Title (`title`):** Item title rendered in bold text.
  * **Description Text (`text`):** Detailed description text.
  * **Link URL (`url` - Optional):** Target destination link.
  * **Link Target (`target` - Optional):** Choice of Same Window (`_self`) or New Tab (`_blank`).

##### Settings Tab
* **Layout Mode (`layout`):** Choice of **Horizontal List** (centered auto-fit column grid) or **Vertical List** (left-aligned stacked rows).
* **Animation on Display (`animation`):** Choice of **None**, **Insert one by one (fade)**, **Insert one by one (sliding in from right)**, or **Insert one by one (sliding in from left)**.

### 18. Flexible Image and Text

* **Technical Names:** `cms-element-flexible-image-text` / `cms-block-flexible-image-text`
* **Description:** A versatile side-by-side or stacked image and rich text block supporting responsive thumbnail rendering (`sw_thumbnails`), custom column split ratios, mobile stacking (image always on top), entrance animations, and 5 distinct presentation themes.

##### Content Tab
* **Image (`media`):** Media library upload or selection.
* **Caption / Label (`caption`):** Optional photo label or Polaroid caption text.
* **Rich Text Content (`content`):** Main text content entered via a rich text editor (`sw-text-editor`).

##### Settings Tab
* **Layout Position (`position`):** Choice of **Image Left + Text Right** or **Text Left + Image Right**. (Automatically stacks vertically with image on top on screens `< 768px`).
* **Column Proportions (`columnSize`):** Choice of **25% - 75%**, **33% - 66%**, **50% - 50%**, **66% - 33%**, or **75% - 25%**.
* **Entrance Animation (`animation`):** Choice of **None**, **Slide in from left / right**, **Fade in**, or **Zoom in**.
* **Presentation Theme (`theme`):** Choice of 5 visual styles:
  * **Traditional:** Clean, classic side-by-side layout.
  * **Polaroid:** Framed photo card with drop-shadow, tilt angle, and bottom caption.
  * **Offset:** Modern overlapping frame design with accent border.
  * **Rounded:** Light container with dashed border and pill-rounded image corners.
  * **Stacked:** Vertical full-width banner image and attached content card.

---

### 19. Harmonica List

A versatile collapsible Bootstrap accordion for general content lists, specifications, feature details, and topic overviews (when FAQ rich snippets are not desired). It provides the exact same functionality, icon support, image uploads, and 5 theme variations as FAQ Harmonica without generating FAQPage structured data markup.

* **Block Name:** `harmonica-list`
* **Element Name:** `harmonica-list`

#### Configuration Options

The configuration modal features two tabs:

##### Content Tab
Manage a dynamic list of collapsible harmonica items. For each item:
* **Icon (`mediaId` / `icon`):** Upload an image file (recommended size: `24x24 px`) or input a standard Shopware icon name (e.g., `regular-comments` or `regular-question-circle-s`).
* **Title (`title`):** The text displayed on the header button of the accordion item.
* **Content (`content`):** A rich-text area (utilizing the built-in `sw-text-editor`) containing the body content.

##### Settings Tab
* **Accordion Theme (`theme`):** Choose from 5 distinct visual styles:
  * **Minimal Clean Dividers (`clean`):** Sleek minimal list layout with hairline horizontal dividers.
  * **Floating Cards (`boxed`):** Floating card boxes with rounded corners, subtle drop shadows, and active primary border outlines.
  * **Accent Toggle Block (`pill-block`):** Elementor-inspired side block button featuring solid `$primary` or `$secondary` badge toggles (`+` / `-`).
  * **Modern Numbered (`editorial-numbered`):** High-impact editorial design with auto-formatted item numbers (`01`, `02`...), diagonal arrow toggles (`↗`), and solid color background row fills when active.
  * **Left Accent Border (`accent-line`):** Clean card rows highlighted with a bold 4px vertical accent bar on the left edge when expanded.

---

## Design Token Color System

The plugin incorporates a 3-tier design token color system referenced in [`style/variables-shopware-legacy.css`](style/variables-shopware-legacy.css) and documented in [`style/COLOR_SYSTEM.md`](style/COLOR_SYSTEM.md) and [`AGENTS.md`](AGENTS.md).

All CMS block and element stylesheets strictly consume mapped tokens (`--ecw-mapped-color-*`) with a built-in 3-tier fallback chain:
1. **Tier 1 (Primary):** `--ecw-mapped-color-*` (Custom theme design token variable)
2. **Tier 2 (Secondary Fallback):** `--bs-*` (Bootstrap 5 standard variable)
3. **Tier 3 (Tertiary Fallback):** Fixed hex/RGB color fallback

```scss
/* Example fallback structure */
background-color: var(--ecw-mapped-color-background-container, var(--bs-card-bg, #ffffff));
border-color: var(--ecw-mapped-color-border-base, var(--bs-border-color, #e2e8f0));
color: var(--ecw-mapped-color-text-normal, var(--bs-body-color, #333333));
```

This guarantees seamless visual integration within bespoke client themes while ensuring that blocks display reliably with standard styling on any default Shopware installation.

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

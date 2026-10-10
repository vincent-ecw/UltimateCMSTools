# Image rendering audit

Date: 2026-10-10. Plugin version: 1.2.55.

## Findings and resolution

The shared carousel selector `[style*="--"]` activated maximum-height image overrides whenever any CSS custom property appeared on a carousel. Adding `--uct-description-lines` therefore changed absolutely positioned images into normal-flow images inside padded frames. Manufacturer logos retained their translation transform, shifting them outside the frame; category photos appeared below the empty frame. Maximum-height constraints now require the explicit `--uct-carousel-max-height` property and never change image positioning or fit rules.

Photo frames use a non-shrinking aspect ratio independent of description length. The frame ratio is a layout property: `object-fit: cover` preserves the source proportions while cropping the excess. Manufacturer logos use an inset image box with `object-fit: contain`, retaining the complete logo without translation offsets. Uniform description space and equal-height grid rows remain intact.

## Complete storefront inventory

| Element / block | Rendering and ratio policy | Source selection |
| --- | --- | --- |
| Subcategory Carousel / Grid | Non-shrinking 4:3 photo frame; square Modern/Playful frames; proportional cover cropping; Badge has no image | Shopware thumbnails with theme candidate minimums and measured sizes |
| Manufacturer Carousel / Grid | Non-shrinking 5:3 logo frame; square Modern/Playful frames; logos contained inside 80% inset box; Badge has no image | Shopware thumbnails with logo candidate minimums and measured sizes |
| Custom Carousel | 4:3 photo frame; Media uses 20:17; Horizontal uses a stretched frame alongside content; cover preserves source ratio | Shopware thumbnails with candidate minimums and measured sizes |
| Common Slider | Picture art direction; proportional cover fit, including configured maximum height | Shopware fallback image and matching responsive source candidates; measured sizes for each source ratio |
| Responsive Image | Natural ratio; contain under maximum-height constraint | Converted original-only fallback to Shopware thumbnails; device sources include original and intrinsic dimensions |
| Image and Text Quartet | Natural ratio; contain under 500px height constraint | Converted original-only fallbacks to Shopware thumbnails; retained mobile/tablet art direction |
| Flexible Image and Text | Natural ratio in every theme; contain under Stacked height constraint | Shopware thumbnails with complete initial sizes and measured column widths |
| Category Header | Designs 1/2/4: cover in fixed rectangle/circle; Designs 3/5: proportional cover background | Foreground: Shopware thumbnails and measured sizes. Backgrounds: original media URL, so no small thumbnail selection |
| Magazine Quote | Proportional cover in author portrait frame | Converted original-only image to Shopware thumbnails with portrait minimums and measured sizes |
| Custom Product Carousel / Related Products | Standard Shopware product card and contained product image | Preserve Shopware product cards; opt into original fallback and measured native thumbnail sizes |
| Single Product | Standard Shopware product image and contain mode | Scope the same policy to the inherited image-thumbnail block, including AJAX card refreshes |
| FAQ Harmonica / Harmonica List | 24px image icons with contain, no stretching | Saved URL-only icons use the original URL (no MediaEntity available); URL filtering, lazy loading and async decoding |
| CTA and CMS section backgrounds | CSS background cover/contain/auto preserve proportions | Original media URLs; no thumbnail downsizing |
| Rich text / Custom Code | Sanitized rich text or explicitly authored custom markup | Arbitrary authored images are outside automatic MediaEntity thumbnail selection |

Administration previews were inspected for image fitting. They use original media URLs with cover/contain/natural-height rules, so they do not select undersized thumbnail candidates. Directory elements currently show placeholders in the administration rather than live resolved media.

## Automatic quality policy

Prefer automatic theme/frame sizing over another manual minimum-resolution setting. The PHP presentation service filters candidate thumbnails; originals are always retained when their dimensions are known. Existing media and media folder settings are unchanged. Cropped/stretched/upscaled thumbnails are excluded when original metadata allows validation, with tolerance for integer pixel rounding. Duplicate widths are collapsed. Unknown original dimensions retain the original `src` fallback through Shopware.

| Candidate profile | Minimum thumbnail dimensions |
| --- | --- |
| Standard photo tiles | 640 × 480 px |
| Custom Carousel Media | 640 × 544 px |
| Modern category tiles | 640 × 640 px |
| Playful category tiles | 336 × 336 px |
| Manufacturer logos | 512 px wide; height follows original ratio |
| Playful manufacturer logos | 336 px wide; height follows original ratio |
| Category Header foreground | 640 × 380 px |
| Author portraits | 160 × 160 px |
| Flexible/content/product images | Responsive measurement determines requirement; no fixed minimum |

These are minimum candidate dimensions, not upload rejection rules or changes to image ratios. Larger frames can require larger sources. The storefront measures the visible image box and sets native `sizes` in CSS pixels; the browser multiplies by device pixel ratio. Cover sizing accounts for the dimension needed to fill the frame, and contain sizing accounts for the visible logo rather than blank surrounding space. A 10% allowance covers existing hover/active scaling. Picture sources are measured separately using their own ratios, and ResizeObserver updates widths when the layout changes. Carousels initialize image sizing after creating loop clones.

The inspected Häagen-Dazs original is 300 × 200 px. Its visible content in the tested Basic carousel was about 205 × 136 CSS pixels at DPR 2, requiring about 450 × 300 source pixels with the scaling allowance. The renderer uses the best available original, but replacing this upload with a larger source or vector logo is necessary for reliable sharpness at that size.

## Verification

- PHPUnit source-selection cases: reject undersized/cropped/upscaled thumbnails, preserve original dimensions and undersized originals, deduplicate widths, tolerate proportional rounding, handle missing metadata/thumbnails, and avoid mutating DAL entities.
- JavaScript source-width checks for square cover crops, wide/portrait contained logos and missing dimensions.
- All storefront Twig templates validate; PHP syntax and service registration validate through the running application.
- Live Brands and Bekleidung pages: verify logos remain inside frames, category photos fill their frames, and original/thumbnail candidates use the expected widths.
- 37 isolated CSS layout fixtures across all directory and Custom Carousel themes, Flexible Image and Text themes, Responsive Image, Quartet, Common Slider with/without maximum height, and portrait styles, checked at desktop, 768px and 390px widths. No empty image frames, unintended stretching, positioned images outside their frames, or unequal Classic/Basic/custom tile heights were detected. These fixtures exercise layout geometry; they do not substitute for every saved CMS configuration or every uploaded image.
- Storefront build, theme compilation and cache clearing completed in Docker.

Security: no new endpoint or writable media operation; candidate data comes from DAL MediaEntity instances, URLs remain encoded by Shopware, attributes remain Twig-escaped, and thumbnail policy is explicitly scoped to plugin images.

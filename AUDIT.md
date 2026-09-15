# Ultimate CMS Tools — source and security audit

Baseline updated 2026-09-13 for plugin version 1.2.24 on `bugfix/ultimate-cms-tools-security-hardening` (Shopware 6.7.13.1). This file records the original findings and their current status; revisit affected paths after each change.

## How the plugin is built

### Single-product addition (1.2.30)

- `SingleProductLoader` uses the decorated Shopware product-detail and variant routes with the current sales-channel context. CMS-page loading is explicitly skipped to prevent recursive product layouts. The loader is lazy because the detail route itself depends on the CMS resolver registry.
- The GET-only `frontend.uct.single_product` widget validates product, slot, group, and option identifiers, caps submitted groups at 32, and marks responses private/no-store. It does not mutate products or carts. Cart submissions use Shopware's existing add-to-cart route and its purchase validation.
- No arbitrary HTML, prices, product URLs, or executable code is accepted from the browser. Product-card rendering retains the theme's existing templates; this addition does not sanitize or change unrelated theme overrides.
- Verification: 22 PHPUnit tests passed (170 assertions), 47 storefront Twig files linted, service-container lint passed, and administration/storefront builds passed. A real two-card CMS fixture rendered successfully with variant controls enabled and disabled. Browser testing confirmed product-number search, product preview updates, switch persistence after saving/reloading, independent in-place variant switching, and the selected Blue/8 Hours SKU entering the cart. The test cart item was removed. Invalid slot identifiers returned HTTP 400. Production cache/proxy testing remains separate from these local checks.

The architecture counts below describe the original 1.2.24 baseline.

- Composer package `vincentbourgonje/ultimate-cms-tools` requires `shopware/core: 6.7.*`; `src/UltimateCmsTools.php` is a minimal `Plugin` class.
- `src/Resources/app/administration/src/main.js` registers 20 matching CMS blocks and elements, plus a section settings override. Vue components, Twig administration templates, and English/German/Dutch snippets define editing controls. The storefront has one block and one element template per CMS type.
- `src/Resources/config/services.xml` tags all 15 `src/DataResolver/*` classes as CMS resolvers. Most use Shopware's DAL criteria collection to fetch media, categories, or manufacturers. `CustomProductCarouselCmsElementResolver` uses the sales-channel product repository and product stream builder; `RelatedProductsCmsElementResolver` calls the cross-selling route.
- `src/Resources/app/storefront/src/main.js` registers eight Shopware storefront plugins for carousels and animations; SCSS lives under `src/Resources/app/storefront/src/scss`. Three migrations create category/manufacturer custom fields. `HttpCacheSubscriber` adds customer group ID to the HTTP cache cookie event. No custom HTTP controller, route, or form handler was found, so there is no plugin-owned CSRF/ACL endpoint to assess.
- The repository contains compiled administration assets under `src/Resources/public/administration`. Source JSON files parse, all 20 block/element registrations pair, and all 15 resolver classes have service registrations.

## Findings, ordered by priority

### H1 — Executable code is a CMS feature (high, intentional capability)

**Accepted by design.** The custom-code element intentionally renders saved CSS and JavaScript with `|raw` in `cms-element-custom-code.html.twig`. Treat CMS editing rights as storefront code deployment rights and grant them only to trusted editors. This behavior was left unchanged.

### H2 — Several saved text values bypass HTML escaping (high)

**Fixed in 1.2.24.** Saved rich text in category header, FAQ, harmonica list, icon list, flexible image text, image/text quartet, and statistics now uses Shopware’s `sw_sanitize` filter at storefront output. The two administration rich-text previews now use `$sanitize(...)` before `v-html`. Shopware’s sanitizer must remain enabled. Recheck this path whenever new rich-text fields are added.

### H3 — Link fields are emitted without scheme validation (high)

**Fixed in 1.2.24.** `src/Twig/CmsSecurityExtension.php` provides `uct_safe_url`; all configurable CMS and manufacturer links apply it before output. It allows local links and valid HTTP(S), protocol-relative, mailto, and tel URLs while rejecting script/data schemes, controls, backslashes, and malformed URLs. Configurable targets are reduced to `_self` or `_blank`. An invalid button URL becomes a harmless `#`; other invalid links are omitted. URL payload unit tests cover these cases.

### M1 — FAQ JSON-LD can terminate its script element (medium)

**Fixed in 1.2.24.** FAQ JSON-LD now uses `JSON_HEX_TAG`, `JSON_HEX_AMP`, `JSON_HEX_APOS`, and `JSON_HEX_QUOT` before writing JSON into the script element. The FAQ visible HTML is separately sanitized under H2. Recheck script-context encoding whenever structured data is added.

### M2 — Customer-group section display is presentation logic (medium, verify caching)

**Open: release-gate cache verification required.** `page/content/detail.html.twig` compares `uct_customer_group_id` with the current customer group and `HttpCacheSubscriber.php` adds the group ID to `HttpCacheCookieEvent`. This remains presentation logic, not authorization for confidential content. A unit test confirms distinct `HttpCacheCookieEvent` hashes for groups A and B, including a logged-in override. The local dev storefront shows `Vary: sw-cache-hash` and ESI headers, but no controlled group-specific CMS fixture and two customer-group sessions were available, so cross-group cache isolation has **not** been proven. Follow the mandatory test matrix below before release. Shopware has documented that custom cache-hash variation may not carry into separately cached header/footer ESI fragments.

### M3 — Broad DAL queries and unrestricted configuration limits (medium, availability)

**Fixed in 1.2.24.** Manufacturer and subcategory DAL criteria now cap results at 100. The custom product carousel caps dynamic selection at 24 and manual IDs at 24; the admin limit field also shows a maximum of 24. Unknown product selection modes are rejected and all product criteria have a fallback limit. Recheck whether these bounds are appropriate on large catalogs and measure render/query time with representative content.

### L1 — Some new-tab links lack explicit opener protection (low)

**Fixed in 1.2.24.** Common slider, custom carousel, and responsive image now add `rel="noopener noreferrer"` when opening `_blank`. Link targets are normalized by H3.

### L2 — Dynamic style values need bounds (low)

**Fixed in 1.2.24.** `CmsSecurityExtension` constrains CSS lengths, colors, media URLs, and carousel numeric settings. CTA minimum height is capped by unit, carousel heights at 2000px and autoplay delay at 60000ms. The custom section rendering validates background color, media URL, and background size. Recheck new inline styles against these filters.

## Existing strengths and limits

The PHP resolvers use DAL criteria or Shopware sales-channel services rather than interpolating input into SQL; only fixed migration SQL was found. No plugin-owned HTTP controller or form handler exists. The remaining deliberate high-risk capability is H1. Runtime cache isolation (M2) and dependency vulnerability status remain unverified.

Validation in `shopware67`: 17 security-filter/JSON-LD/cache-hash tests (34 assertions), PHP lint, all 41 storefront Twig templates linted, `cache:clear`, administration build, storefront build, and `theme:compile` passed. `plugin:refresh` and `plugin:update UltimateCmsTools` completed; the active installation reports 1.2.24. Composer validation passed with environment/version warnings, and `git diff --check` passed. The admin build produced dependency/size warnings. The local guest homepage returned HTTP 200 with `Vary: sw-cache-hash`; repeated dev requests did not establish a customer-group cache hit. No production-mode group/cache fixture test or dependency vulnerability audit was run.

## Mandatory customer-group cache release test (M2)

Version 1.2.25 adds login-status section visibility and a matching `uct-login-status` cache-cookie contribution. Guest checkout customers use the logged-out state. Local validation passed: 19 tests (68 assertions), including 32 section visibility cases and same-group anonymous/guest/logged-in cache-hash comparisons; Twig lint, administration/storefront builds, cache clear, and theme compilation also passed. Browser save/reload behavior and production-like warm-cache isolation remain unverified.

Include logged-in-only and logged-out-only section markers in the following matrix, and test a guest checkout session as well as an anonymous visitor. Existing customer-group restrictions now imply logged-in-only visibility when no explicit login setting is saved.

1. In a production-like environment with Shopware HTTP cache and the deployed reverse proxy enabled, prepare one CMS page with unique visible markers for an unrestricted section, a section restricted to group A, and one restricted to group B. Use two separate customer accounts in those groups plus a guest session. Do not put secrets in CMS configuration for this test.
2. Clear HTTP/reverse-proxy caches. Request the identical URL as guest, A, B, then A again and B again, using separate cookie jars. Repeat in reverse order after another clear. Each response must contain only the unrestricted marker and its own group marker; any wrong-group marker is a release blocker.
3. Repeat after login, logout, customer-group change, and with missing/stale `sw-cache-hash` cookies while retaining the session. Inspect `Vary`, `sw-cache-hash`, `Age`, and reverse-proxy hit headers for the main response. Test ESI header/footer separately if group-specific sections appear there. Verify the same result with cold and warm caches.
4. If any request leaks or reuses another group’s markup, do not release. Correct the cache key/ESI variation or disable caching for affected pages, then rerun the full matrix. Record environment, URL, group IDs, cache headers, and pass/fail evidence in this file.

## Reuse this baseline when changing the plugin

1. Start from the architecture map above and inspect the files touched by the requested change plus their corresponding admin config, resolver, and storefront template. Update this document's date/version and remove or revise findings only after verifying the fix.
2. For any new CMS input, trace saved config through resolver and Twig/JavaScript output. Recheck HTML, URL, CSS, JSON-in-script, and `v-html` contexts; verify server-side bounds and sanitization, not just editor widgets.
3. For new DAL queries, verify sales-channel visibility where applicable, limits, associations, and cache behavior. For customer-group behavior, test warm/cold caches and remember that hidden markup is not an authorization boundary.
4. When Docker works, run PHP lint/tests as appropriate, `bin/console cache:clear`, `./bin/build-administration.sh` for admin changes, and `./bin/build-storefront.sh` plus `bin/console theme:compile` for storefront/theme changes, all through `docker exec shopware67`.

References: [Twig raw filter](https://twig.symfony.com/doc/3.x/filters/raw.html), [Symfony Twig autoescaping](https://symfony.com/doc/current/reference/configuration/twig.html), [Symfony HTML Sanitizer](https://symfony.com/doc/7.4/html_sanitizer.html), [Shopware HTTP cache/ESI issue](https://github.com/shopware/shopware/issues/16445).

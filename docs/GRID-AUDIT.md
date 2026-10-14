# Page Structure Grid audit — 2026-10-14

Scope: the grid registration, shared canvas/configuration/preview components, sidebar override, grid storefront templates and styles, media Twig extension, service registration, and template priority introduced in versions 1.2.59–1.2.61.

## Findings addressed in 1.2.62

- Validate CSS value tokens separately from HTML escaping, reject declaration separators and CSS escapes, restrict image URL schemes and background sizing modes.
- Resolve configured media IDs through the media repository using the sales-channel context. Invalid IDs and private media do not render, including through stale URL fallback.
- Use block/column-specific upload tags and listeners, capture the destination before asynchronous loading, and discard completion after a block change.
- Ignore malformed administration slot order configuration and duplicate storefront ordering entries.
- Respect cms.editor ACL and current page locks for column properties and add/reorder/remove controls. Server authorization remains Shopware's existing CMS/media DAL API enforcement; no custom endpoints were added.
- Replace fixed editor colors with mapped tokens and Bootstrap/fixed fallbacks.
- Remove redundant media initialization; fix toolbar collision and sidebar bottom spacing.

## Follow-ups and coexistence completed in 2.0.0

- Background media is batched through `GridColumnsSubscriber`: one DAL query per CMS load, no Twig queries, private/missing media excluded.
- All 11 new layouts share one catalog. New block, component and template names use `uct-grid-*`.
- The 1.2.63 template finder compatibility rule was removed after confirming that the legacy plugin is active in production. Legacy `grid-*` blocks now retain their own templates and administration registrations. Normal theme inheritance is preserved.
- Global new-grid availability defaults to off. Saved new grids stay editable/renderable. Only the flag is exposed through an authenticated, CMS-read-only endpoint.
- A dry-run-first, explicitly-scoped migration command preserves IDs/content/configuration and requires a durable backup for applying changes; restoration validates source types, ownership, versions and locks.

## Verification

- 15 PHPUnit tests passed (142 assertions): CSS/URL safety, batched/private/missing media, all 11 namespaced layouts, independent resolution of installed legacy templates, theme overrides, migration scope/locks/backups/type-only writes/rollback and settings API permission/method contract.
- Six Node tests passed: column ordering, upload isolation, read-only guards, disabled/enabled picker behavior, category visibility and collision-free component/block registration.
- Both plugins were installed and active during administration and storefront builds and browser verification.
- The browser rendered a legacy and a new grid together on one unassigned page. Legacy had its original controls; new grids retained columns, stacking and column settings.
- The global setting was tested off/on/off. Legacy choices stayed available; enabling exposed all 11 new choices. Disabling hid the empty Page Structure category while saved new grids stayed editable and renderable.
- A new-grid CSS class was saved while creation was disabled and verified after reload and in storefront HTML. At 375px both builders stacked without horizontal overflow. Temporary viewport overrides were reset.
- Fixture conversion and restoration preserved a hash of slot IDs/names/types/content/configuration and block custom fields.
- Four early UCT blocks were converted after a reviewed dry run and backup. Fifteen original legacy/ambiguous blocks were left unchanged.
- PHP/Twig/service lint, administration/storefront builds, theme compilation and cache clear passed in `shopware67`.

See [rollout/migration instructions](GRID-MIGRATION.md) and [browser evidence](grid-coexistence-verification.jpg).

## Scope

This review covers the grid feature, both installed builders, ECWBaseTheme and targeted regression checks. It does not certify every third-party theme/plugin combination or constitute a full plugin penetration test. Migration preserves stored styling/configuration; theme overrides referencing old type names require explicit adaptation.

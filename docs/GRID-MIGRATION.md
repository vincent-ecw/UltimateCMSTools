# Grid builders: coexistence and migration

UltimateCmsTools 2.0.0 uses `uct-grid-*` block types, administration components and storefront templates. The legacy Sschreier plugin retains `grid-*`. There is no legacy template replacement or plugin-wide template priority override.

## Optional creation

In UltimateCmsTools configuration, select **All sales channels** and enable **Grid builder → Enable new Grid builder** to expose the 11 new layouts in Page Structure. The default is off.

This is a global picker availability setting, not a content switch or an authorization boundary. Existing new grids stay registered, editable (subject to CMS permissions/page locks) and renderable. Existing layouts can still be copied. Sales-channel-specific overrides are ignored because CMS layouts can be shared across channels. Reopen the layout editor after changing the setting.

CMS readers fetch only this boolean through the authenticated GET `/api/_action/uct/grid-builder-settings`, guarded by `cms_page:read`. They do not gain access to other system configuration. Configuration writes retain Shopware's normal settings permissions.

## Deployment and early UltimateCmsTools grids

Early grid development snapshots (1.2.59–1.2.63) saved new grids under the same `grid-*` names as Sschreier. A block type alone cannot identify which builder created it.

Deploy during a CMS editing pause, back up the database, and convert confirmed early UltimateCmsTools blocks as part of the same rollout before reopening the editor. Keep the legacy plugin active while unconverted legacy blocks remain. Clear cache and reload administration after conversion; an old open editor can still contain the old block types.

The `--uct-only` selector detects non-empty `uct_columns` styling/order or UUID-suffixed stacked slots. An empty `uct_columns` object and `uct_selected_column` alone are not evidence. This is a data-based filter, not guaranteed provenance. Review the dry run and explicitly select ambiguous pages when their ownership is known.

## Preview and apply

Run commands inside `shopware67`, with `/var/www/html` as the working directory. All examples below use Docker accordingly.

Preview a selected page; repeat `--page` for several pages:

```sh
docker exec shopware67 bin/console uct:grid:migrate --page=<cms-page-uuid> --dry-run
```

Preview identifiable early UltimateCmsTools grids across all live pages:

```sh
docker exec shopware67 bin/console uct:grid:migrate --all --uct-only --dry-run
```

After reviewing, repeat the same selection with an explicit apply and a new backup path:

```sh
docker exec shopware67 bin/console uct:grid:migrate --page=<cms-page-uuid> --apply --backup=/var/www/html/var/grid-migration-001.json
docker exec shopware67 bin/console cache:clear
```

Without `--uct-only`, all supported legacy-name blocks on selected pages are proposed. `--all` without that filter explicitly selects all such blocks in the shop; use it only when that is the intended migration.

The command:
- Requires explicit page selection or `--all`; default operation is a dry run.
- Handles live versions only and skips locked blocks/pages.
- Creates, flushes and syncs a new local JSON backup before writes; refuses existing paths and stream wrappers.
- Revalidates IDs, page ownership, source type, version and locks before applying the batch.
- Updates only `cms_block.type` through DAL. It preserves block/page/section/slot IDs, slot content and configuration, custom fields, media references and layout assignments.
- Is idempotent for conversion: already namespaced blocks are not selected.
- Requires a CMS editing pause to avoid concurrent changes during preview/application.

Review theme customizations before migrating: legacy Twig blocks/files and CSS selectors referencing `grid-*` are not copied to the new namespace. Adapt those overrides for `uct-grid-*` where needed.

## Restore a migration

Preview reversing a backup:

```sh
docker exec shopware67 bin/console uct:grid:migrate --restore=/var/www/html/var/grid-migration-001.json --dry-run
```

Apply the reverse conversion with a separate backup:

```sh
docker exec shopware67 bin/console uct:grid:migrate --restore=/var/www/html/var/grid-migration-001.json --apply --backup=/var/www/html/var/grid-restore-001.json
docker exec shopware67 bin/console cache:clear
```

Restoration rejects unsupported type pairs, non-live versions, changed/missing blocks, moved blocks and locked pages. It reverses only types; it does not roll back subsequent content edits.

Restoring early UltimateCmsTools blocks to shared legacy names also requires the matching old UltimateCmsTools code to render their column styling and stacked slots. The legacy builder cannot display those newer features. Keep that code/version rollback coordinated with the type rollback. Restoring an originally legacy block requires the legacy plugin to remain active.

## Retiring the legacy plugin

Run `uct:grid:migrate --all --dry-run` inside Docker to inventory remaining legacy-name blocks, including skipped locked blocks. Remove the legacy plugin only once that inventory is empty and affected themes/layouts have been verified.

## Local verification

Both plugins were installed and active. An unassigned Grid coexistence verification layout contained a legacy and a new block on the same page. Both administration components and storefront renderers worked independently. The setting was tested off/on/off; legacy choices remained available, all 11 new choices appeared only when enabled, and a saved new grid was edited and rendered while disabled.

Migration and restoration were executed on that fixture. A hash of slot IDs/names/types/content/configuration and block custom fields was identical before, after conversion and after restoration. Four previously-created UCT blocks were converted with a backup; 15 original legacy/ambiguous blocks were skipped.

The local setting is left disabled. The legacy plugin is left active for inspection. [Verification screenshot](grid-coexistence-verification.jpg).

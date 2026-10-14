<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Core;

use Shopware\Core\Content\Cms\Aggregate\CmsBlock\CmsBlockEntity;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\Uuid\Uuid;

final class GridMigration
{
    public function __construct(
        private readonly EntityRepository $blockRepository,
        private readonly GridLayouts $layouts,
    ) {
    }

    /** @return array<string, string> Legacy type => namespaced type. */
    public function typeMap(): array
    {
        $map = [];
        foreach ($this->layouts->getTypes() as $type) {
            $legacy = str_starts_with($type, 'uct-') ? substr($type, 4) : $type;
            $map[$legacy] = 'uct-' . $legacy;
        }
        return $map;
    }

    public function plan(array $pageIds, bool $all, bool $uctOnly, Context $context): array
    {
        if (($pageIds === []) === !$all) {
            throw new \InvalidArgumentException('Choose either one or more --page IDs or --all.');
        }
        foreach ($pageIds as $id) {
            if (!\is_string($id) || !Uuid::isValid($id)) {
                throw new \InvalidArgumentException('Every page ID must be a valid UUID.');
            }
        }
        $map = $this->typeMap();
        $criteria = (new Criteria())->setLimit(200);
        $criteria->addFilter(new EqualsAnyFilter('type', array_keys($map)));
        if (!$all) {
            $criteria->addFilter(new EqualsAnyFilter('section.pageId', $pageIds));
        }
        $criteria->addAssociation('section.page');
        $criteria->addAssociation('slots');
        $criteria->addSorting(new FieldSorting('id'));
        $changes = [];
        $skipped = [];
        for ($offset = 0; ; $offset += 200) {
            $criteria->setOffset($offset);
            $result = $this->blockRepository->search($criteria, $context);
            foreach ($result as $block) {
                $page = $block->getSection()?->getPage();
                if (!$page || $page->getLocked() || $block->getLocked()) {
                    $skipped[] = ['blockId' => $block->getId(), 'reason' => 'Locked block/page or missing page association'];
                    continue;
                }
                $evidence = $this->hasUctData($block);
                if ($uctOnly && !$evidence) {
                    $skipped[] = ['blockId' => $block->getId(), 'reason' => 'No identifiable UltimateCmsTools column/stack data'];
                    continue;
                }
                $changes[] = [
                    'blockId' => $block->getId(),
                    'versionId' => $block->getVersionId(),
                    'pageId' => $page->getId(),
                    'from' => $block->getType(),
                    'to' => $map[$block->getType()],
                    'evidence' => $evidence ? 'UCT column/stack data' : 'Legacy or ambiguous',
                ];
            }
            if ($result->count() < 200) {
                break;
            }
        }
        return ['changes' => $changes, 'skipped' => $skipped];
    }

    public function hasUctData(CmsBlockEntity $block): bool
    {
        $columns = $block->getCustomFields()['uct_columns'] ?? [];
        if (\is_array($columns)) {
            foreach ($columns as $config) {
                if (!\is_array($config)) {
                    continue;
                }
                foreach (['padding', 'backgroundColor', 'backgroundMediaId', 'backgroundMediaUrl', 'cssClass'] as $key) {
                    if (\is_string($config[$key] ?? null) && trim($config[$key]) !== '') {
                        return true;
                    }
                }
                if (\is_array($config['slot_order'] ?? null) && $config['slot_order'] !== []) {
                    return true;
                }
            }
        }
        foreach ($block->getSlots() ?? [] as $slot) {
            if (preg_match('/^content(?:[1-6])?_[0-9a-f]{32}$/D', $slot->getSlot())) {
                return true;
            }
        }
        return false;
    }

    public function restorePlan(array $snapshot): array
    {
        if (($snapshot['schemaVersion'] ?? null) !== 1 || !\is_array($snapshot['changes'] ?? null)) {
            throw new \InvalidArgumentException('Unsupported grid migration backup.');
        }
        $changes = [];
        foreach ($snapshot['changes'] as $change) {
            $this->validateChange($change);
            $changes[] = [...$change, 'from' => $change['to'], 'to' => $change['from'], 'evidence' => 'Restore backup'];
        }
        return ['changes' => $changes, 'skipped' => []];
    }

    /** Revalidate every block before writing only its type through DAL. */
    public function apply(array $changes, Context $context): void
    {
        $expected = [];
        foreach ($changes as $change) {
            $this->validateChange($change);
            if (isset($expected[$change['blockId']])) {
                throw new \InvalidArgumentException('Duplicate block in migration plan.');
            }
            if (str_starts_with($change['to'], 'uct-') && !$this->layouts->has($change['to'])) {
                throw new \LogicException('Namespaced grid definitions must be installed before applying the migration.');
            }
            $expected[$change['blockId']] = $change;
        }
        $updates = [];
        foreach (array_chunk(array_keys($expected), 200) as $ids) {
            $criteria = (new Criteria($ids))->setLimit(200);
            $criteria->addAssociation('section.page');
            $result = $this->blockRepository->search($criteria, $context);
            foreach ($result as $block) {
                $change = $expected[$block->getId()];
                $page = $block->getSection()?->getPage();
                if ($block->getType() !== $change['from']
                    || $block->getVersionId() !== $change['versionId']
                    || !$page || $page->getId() !== $change['pageId']
                    || $page->getLocked() || $block->getLocked()) {
                    throw new \RuntimeException('Block changed, moved or locked since preview: ' . $block->getId() . '. Nothing was migrated.');
                }
                $updates[] = ['id' => $block->getId(), 'versionId' => $change['versionId'], 'type' => $change['to']];
            }
            if ($result->count() !== \count($ids)) {
                throw new \RuntimeException('A migration block no longer exists. Nothing was migrated.');
            }
        }
        if ($updates !== []) {
            // DAL's write transaction applies the complete type-only update.
            $this->blockRepository->update($updates, $context);
        }
    }

    private function validateChange(mixed $change): void
    {
        if (!\is_array($change)) {
            throw new \InvalidArgumentException('Malformed migration entry.');
        }
        foreach (['blockId', 'pageId', 'versionId'] as $key) {
            if (!\is_string($change[$key] ?? null) || !Uuid::isValid($change[$key])) {
                throw new \InvalidArgumentException('Invalid migration UUID.');
            }
        }
        if ($change['versionId'] !== Defaults::LIVE_VERSION) {
            throw new \InvalidArgumentException('Only live CMS blocks can be migrated.');
        }
        $from = $change['from'] ?? null;
        $to = $change['to'] ?? null;
        $map = $this->typeMap();
        if (!\is_string($from) || !\is_string($to)
            || (($map[$from] ?? null) !== $to && ($map[$to] ?? null) !== $from)) {
            throw new \InvalidArgumentException('Only known legacy/namespaced grid type pairs can be changed.');
        }
    }
}

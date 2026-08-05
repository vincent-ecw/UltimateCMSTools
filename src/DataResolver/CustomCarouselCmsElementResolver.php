<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Content\Media\MediaDefinition;

class CustomCarouselCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'custom-carousel';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $carouselItemsConfig = $config->get('carouselItems');

        if (!$carouselItemsConfig || $carouselItemsConfig->isMapped() || $carouselItemsConfig->getValue() === null) {
            return null;
        }

        $items = $carouselItemsConfig->getValue();
        $mediaIds = [];

        foreach ($items as $item) {
            if (!empty($item['mediaId'])) {
                $mediaIds[] = $item['mediaId'];
            }
        }

        $mediaIds = array_unique($mediaIds);

        if (empty($mediaIds)) {
            return null;
        }

        $criteria = new Criteria($mediaIds);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $config = $slot->getFieldConfig();
        $carouselItemsConfig = $config->get('carouselItems');

        if (!$carouselItemsConfig || $carouselItemsConfig->isMapped() || $carouselItemsConfig->getValue() === null) {
            return;
        }

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        $mediaCollection = $searchResult ? $searchResult->getEntities() : null;

        $items = $carouselItemsConfig->getValue();
        $now = new \DateTimeImmutable();
        $activeItems = [];

        foreach ($items as $item) {
            if (!empty($item['showStartDate'])) {
                try {
                    $startDate = new \DateTimeImmutable($item['showStartDate']);
                    if ($now < $startDate) {
                        continue;
                    }
                } catch (\Throwable $e) {
                    // Ignore date parse failure
                }
            }

            if (!empty($item['showEndDate'])) {
                try {
                    $endDate = new \DateTimeImmutable($item['showEndDate']);
                    if ($now > $endDate) {
                        continue;
                    }
                } catch (\Throwable $e) {
                    // Ignore date parse failure
                }
            }

            if (!empty($item['mediaId']) && $mediaCollection) {
                $item['media'] = $mediaCollection->get($item['mediaId']);
            }

            $activeItems[] = $item;
        }

        $itemsToDisplayConfig = $config->get('itemsToDisplay');
        if ($itemsToDisplayConfig && $itemsToDisplayConfig->getValue() !== null) {
            $limit = (int) $itemsToDisplayConfig->getValue();
            if ($limit > 0) {
                $activeItems = array_slice($activeItems, 0, $limit);
            }
        }

        $data = new \Shopware\Core\Framework\Struct\ArrayStruct([
            'carouselItems' => $activeItems
        ]);

        $slot->setData($data);
    }
}

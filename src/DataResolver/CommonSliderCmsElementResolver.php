<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;

class CommonSliderCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'common-slider';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $sliderItemsConfig = $config->get('sliderItems');

        if (!$sliderItemsConfig || $sliderItemsConfig->isMapped() || $sliderItemsConfig->getValue() === null) {
            return null;
        }

        $items = $sliderItemsConfig->getValue();
        $mediaIds = [];

        foreach ($items as $item) {
            if (!empty($item['mediaIdDesktop'])) {
                $mediaIds[] = $item['mediaIdDesktop'];
            }
            if (!empty($item['mediaIdTablet'])) {
                $mediaIds[] = $item['mediaIdTablet'];
            }
            if (!empty($item['mediaIdMobile'])) {
                $mediaIds[] = $item['mediaIdMobile'];
            }
        }

        $mediaIds = array_unique($mediaIds);

        if (empty($mediaIds)) {
            return null;
        }

        $criteria = new Criteria($mediaIds);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), \Shopware\Core\Content\Media\MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $config = $slot->getFieldConfig();
        $sliderItemsConfig = $config->get('sliderItems');

        if (!$sliderItemsConfig || $sliderItemsConfig->isMapped() || $sliderItemsConfig->getValue() === null) {
            return;
        }

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if (!$searchResult) {
            return;
        }

        $mediaCollection = $searchResult->getEntities();

        $items = $sliderItemsConfig->getValue();
        foreach ($items as &$item) {
            if (!empty($item['mediaIdDesktop'])) {
                $item['mediaDesktop'] = $mediaCollection->get($item['mediaIdDesktop']);
            }
            if (!empty($item['mediaIdTablet'])) {
                $item['mediaTablet'] = $mediaCollection->get($item['mediaIdTablet']);
            }
            if (!empty($item['mediaIdMobile'])) {
                $item['mediaMobile'] = $mediaCollection->get($item['mediaIdMobile']);
            }
        }

        $data = new \Shopware\Core\Framework\Struct\ArrayStruct([
            'sliderItems' => $items
        ]);

        $slot->setData($data);
    }
}

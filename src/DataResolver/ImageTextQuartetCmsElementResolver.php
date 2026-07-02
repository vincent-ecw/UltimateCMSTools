<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Framework\Struct\ArrayStruct;

class ImageTextQuartetCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'image-text-quartet';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        
        $mediaFields = [
            'media1Desktop', 'media1Tablet', 'media1Mobile',
            'media2Desktop', 'media2Tablet', 'media2Mobile'
        ];

        $mediaIds = [];

        foreach ($mediaFields as $fieldName) {
            $mediaConfig = $config->get($fieldName);
            if ($mediaConfig && !$mediaConfig->isMapped() && $mediaConfig->getValue() !== null) {
                $mediaIds[] = $mediaConfig->getValue();
            }
        }

        $mediaIds = array_unique(array_filter($mediaIds));

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
        
        $mediaFields = [
            'media1Desktop', 'media1Tablet', 'media1Mobile',
            'media2Desktop', 'media2Tablet', 'media2Mobile'
        ];

        $resolvedMedia = [];
        foreach ($mediaFields as $fieldName) {
            $resolvedMedia[$fieldName] = null;
        }

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if ($searchResult) {
            $mediaCollection = $searchResult->getEntities();

            foreach ($mediaFields as $fieldName) {
                $mediaConfig = $config->get($fieldName);
                if ($mediaConfig && $mediaConfig->getValue()) {
                    $resolvedMedia[$fieldName] = $mediaCollection->get($mediaConfig->getValue());
                }
            }
        }

        $data = new ArrayStruct($resolvedMedia);

        $slot->setData($data);
    }
}

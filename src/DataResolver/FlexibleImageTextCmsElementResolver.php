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

class FlexibleImageTextCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'flexible-image-text';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $mediaConfig = $config->get('media');

        if (!$mediaConfig || $mediaConfig->isMapped() || $mediaConfig->getValue() === null) {
            return null;
        }

        $mediaId = $mediaConfig->getValue();
        if (empty($mediaId)) {
            return null;
        }

        $criteria = new Criteria([$mediaId]);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $config = $slot->getFieldConfig();
        $mediaConfig = $config->get('media');

        $media = null;

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if ($searchResult && $mediaConfig && $mediaConfig->getValue()) {
            $mediaCollection = $searchResult->getEntities();
            $media = $mediaCollection->get($mediaConfig->getValue());
        }

        $data = new ArrayStruct([
            'media' => $media,
        ]);

        $slot->setData($data);
    }
}

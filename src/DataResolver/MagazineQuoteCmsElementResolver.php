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

class MagazineQuoteCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'magazine-quote';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $authorImageConfig = $config->get('authorImage');

        if (!$authorImageConfig || $authorImageConfig->isMapped() || $authorImageConfig->getValue() === null) {
            return null;
        }

        $criteria = new Criteria([$authorImageConfig->getValue()]);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $config = $slot->getFieldConfig();
        $authorImageConfig = $config->get('authorImage');

        $authorImage = null;

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if ($searchResult && $authorImageConfig && $authorImageConfig->getValue()) {
            $mediaCollection = $searchResult->getEntities();
            $authorImage = $mediaCollection->get($authorImageConfig->getValue());
        }

        $data = new ArrayStruct([
            'authorImage' => $authorImage
        ]);

        $slot->setData($data);
    }
}

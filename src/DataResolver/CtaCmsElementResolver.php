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

class CtaCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'cta';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $backgroundImageConfig = $config->get('backgroundImage');

        if (!$backgroundImageConfig || $backgroundImageConfig->isMapped() || $backgroundImageConfig->getValue() === null) {
            return null;
        }

        $criteria = new Criteria([$backgroundImageConfig->getValue()]);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $config = $slot->getFieldConfig();
        $backgroundImageConfig = $config->get('backgroundImage');

        $backgroundImage = null;

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if ($searchResult && $backgroundImageConfig && $backgroundImageConfig->getValue()) {
            $mediaCollection = $searchResult->getEntities();
            $backgroundImage = $mediaCollection->get($backgroundImageConfig->getValue());
        }

        $data = new ArrayStruct([
            'backgroundImage' => $backgroundImage
        ]);

        $slot->setData($data);
    }
}

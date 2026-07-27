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

class ResponsiveImageCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'responsive-image';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $mediaDesktopConfig = $config->get('mediaDesktop');
        $mediaTabletConfig = $config->get('mediaTablet');
        $mediaMobileConfig = $config->get('mediaMobile');

        $mediaIds = [];

        if ($mediaDesktopConfig && !$mediaDesktopConfig->isMapped() && $mediaDesktopConfig->getValue() !== null) {
            $mediaIds[] = $mediaDesktopConfig->getValue();
        }

        if ($mediaTabletConfig && !$mediaTabletConfig->isMapped() && $mediaTabletConfig->getValue() !== null) {
            $mediaIds[] = $mediaTabletConfig->getValue();
        }

        if ($mediaMobileConfig && !$mediaMobileConfig->isMapped() && $mediaMobileConfig->getValue() !== null) {
            $mediaIds[] = $mediaMobileConfig->getValue();
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
        $mediaDesktopConfig = $config->get('mediaDesktop');
        $mediaTabletConfig = $config->get('mediaTablet');
        $mediaMobileConfig = $config->get('mediaMobile');

        $mediaDesktop = null;
        $mediaTablet = null;
        $mediaMobile = null;

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if ($searchResult) {
            $mediaCollection = $searchResult->getEntities();

            if ($mediaDesktopConfig && $mediaDesktopConfig->getValue()) {
                $mediaDesktop = $mediaCollection->get($mediaDesktopConfig->getValue());
            }

            if ($mediaTabletConfig && $mediaTabletConfig->getValue()) {
                $mediaTablet = $mediaCollection->get($mediaTabletConfig->getValue());
            }

            if ($mediaMobileConfig && $mediaMobileConfig->getValue()) {
                $mediaMobile = $mediaCollection->get($mediaMobileConfig->getValue());
            }
        }

        $data = new ArrayStruct([
            'mediaDesktop' => $mediaDesktop,
            'mediaTablet' => $mediaTablet,
            'mediaMobile' => $mediaMobile
        ]);

        $slot->setData($data);
    }
}

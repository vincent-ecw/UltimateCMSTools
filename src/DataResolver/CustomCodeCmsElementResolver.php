<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;

class CustomCodeCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'custom-code';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        return null;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        // The config is already in the slot, we just need to make sure it's available.
        // Base AbstractCmsElementResolver doesn't do much by default, but existing
        // config in $slot->getConfig() is typically available in Twig as element.config.

        // However, explicit enrichment ensures we have control.
        // For static config, simply returning is usually enough if the Core handles the rest.
        // But simply having the resolver registered with the correct type is the key.
    }
}

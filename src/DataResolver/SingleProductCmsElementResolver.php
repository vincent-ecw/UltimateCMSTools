<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Product\Exception\ProductNotFoundException;
use Shopware\Core\Framework\Uuid\Uuid;
use VincentBourgonje\UltimateCmsTools\Core\SingleProductLoader;

final class SingleProductCmsElementResolver extends AbstractCmsElementResolver
{
    public function __construct(private readonly SingleProductLoader $loader) {}
    public function getType(): string { return 'uct-single-product'; }
    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection { return null; }
    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $id = $slot->getFieldConfig()->get('product')?->getValue();
        if (!is_string($id) || !Uuid::isValid($id)) {
            return;
        }
        try {
            $slot->setData($this->loader->load(
                $id,
                (bool) $slot->getFieldConfig()->get('showVariants')?->getValue(),
                $resolverContext->getSalesChannelContext(),
            ));
        } catch (ProductNotFoundException) {
            // Deleted, inactive or unavailable in this sales channel.
        }
    }
}

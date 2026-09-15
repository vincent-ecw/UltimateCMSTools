<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Core;

use Shopware\Core\Content\Product\SalesChannel\Detail\AbstractProductDetailRoute;
use Shopware\Core\Content\Product\SalesChannel\FindVariant\AbstractFindProductVariantRoute;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Struct\ArrayStruct;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\Request;

class SingleProductLoader
{
    public function __construct(
        private readonly AbstractProductDetailRoute $detailRoute,
        private readonly AbstractFindProductVariantRoute $variantRoute,
    ) {
    }

    /** @param array<string, string> $options */
    public function load(string $productId, bool $showVariants, SalesChannelContext $context, array $options = [], ?string $switched = null): ArrayStruct
    {
        // Avoid resolving a product CMS page recursively when this element is on it.
        $request = new Request(['skipCmsPage' => true, 'skipConfigurator' => !$showVariants]);
        $criteria = (new Criteria())->addAssociation('cover.media')->addAssociation('options.group')->addAssociation('manufacturer');
        $detail = $this->detailRoute->load($productId, $request, $context, $criteria);
        if ($showVariants && $options !== [] && $detail->getProduct()->getParentId()) {
            $variant = $this->variantRoute->load(
                $detail->getProduct()->getParentId(),
                new Request(['options' => $options, 'switchedGroup' => $switched]),
                $context,
            );
            $detail = $this->detailRoute->load($variant->getFoundCombination()->getVariantId(), $request, $context, clone $criteria);
        }

        return new ArrayStruct([
            'product' => $detail->getProduct(),
            'configurator' => $showVariants ? $detail->getConfigurator() : null,
            'showVariants' => $showVariants,
        ]);
    }
}

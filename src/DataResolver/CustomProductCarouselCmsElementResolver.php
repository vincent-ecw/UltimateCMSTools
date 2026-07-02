<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Grouping\FieldGrouping;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotEqualsFilter;
use Shopware\Core\Content\Product\ProductDefinition;
use Shopware\Core\Content\ProductStream\Service\ProductStreamBuilderInterface;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelRepository;

class CustomProductCarouselCmsElementResolver extends AbstractCmsElementResolver
{
    private SalesChannelRepository $productRepository;
    private ProductStreamBuilderInterface $productStreamBuilder;

    public function __construct(
        SalesChannelRepository $productRepository,
        ProductStreamBuilderInterface $productStreamBuilder
    ) {
        $this->productRepository = $productRepository;
        $this->productStreamBuilder = $productStreamBuilder;
    }

    public function getType(): string
    {
        return 'custom-product-carousel';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $selectionType = $config->get('productSelectionType') ? $config->get('productSelectionType')->getValue() : 'manual';
        $limit = $config->get('limit') ? (int) $config->get('limit')->getValue() : 10;

        $criteria = new Criteria();
        $criteria->addState(Criteria::STATE_ELASTICSEARCH_AWARE);
        $criteria->addAssociation('cover');
        
        // Group by displayGroup to avoid duplicates
        $criteria->addGroupField(new FieldGrouping('displayGroup'));
        $criteria->addFilter(new NotEqualsFilter('displayGroup', null));

        if ($selectionType === 'manual') {
            $productsConfig = $config->get('products');
            if (!$productsConfig || !$productsConfig->getValue()) {
                return null;
            }
            $productIds = $productsConfig->getValue();
            if (empty($productIds)) {
                return null;
            }
            $criteria->setIds($productIds);
        } elseif ($selectionType === 'product_stream') {
            $streamConfig = $config->get('productStreamId');
            if (!$streamConfig || !$streamConfig->getValue()) {
                return null;
            }
            $streamId = $streamConfig->getValue();
            $filters = $this->productStreamBuilder->buildFilters(
                $streamId,
                $resolverContext->getSalesChannelContext()->getContext()
            );
            $criteria->addFilter(...$filters);
            $criteria->setLimit($limit);
        } elseif ($selectionType === 'latest') {
            $criteria->addSorting(new FieldSorting('createdAt', FieldSorting::DESCENDING));
            $criteria->setLimit($limit);
        } elseif ($selectionType === 'sale') {
            $criteria->addFilter(new RangeFilter('cheapestPrice.percentage', [RangeFilter::GT => 0]));
            $criteria->setLimit($limit);
        }

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('products_' . $slot->getUniqueIdentifier(), ProductDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $searchResult = $result->get('products_' . $slot->getUniqueIdentifier());
        if (!$searchResult) {
            return;
        }

        $products = $searchResult->getEntities();
        
        $config = $slot->getFieldConfig();
        $selectionType = $config->get('productSelectionType') ? $config->get('productSelectionType')->getValue() : 'manual';
        if ($selectionType === 'manual') {
            $productsConfig = $config->get('products');
            if ($productsConfig && $productsConfig->getValue()) {
                $productIds = $productsConfig->getValue();
                $products->sortByIdArray($productIds);
            }
        }

        $data = new \Shopware\Core\Framework\Struct\ArrayStruct([
            'products' => $products
        ]);

        $slot->setData($data);
    }
}

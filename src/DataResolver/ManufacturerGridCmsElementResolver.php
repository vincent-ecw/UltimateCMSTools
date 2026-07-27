<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Product\Aggregate\ProductManufacturer\ProductManufacturerDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\Struct\ArrayStruct;

class ManufacturerGridCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'manufacturer-grid';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('customFields.ultimate_cms_tools_show_in_grid', true));
        $criteria->addAssociation('media');
        $criteria->addSorting(new FieldSorting('name', FieldSorting::ASCENDING));

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('manufacturer_grid_' . $slot->getUniqueIdentifier(), ProductManufacturerDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $key = 'manufacturer_grid_' . $slot->getUniqueIdentifier();
        $searchResult = $result->get($key);

        if (!$searchResult) {
            return;
        }

        $manufacturers = $searchResult->getEntities();
        $requestHost = $resolverContext->getRequest()?->getHost();

        foreach ($manufacturers as $manufacturer) {
            $link = $manufacturer->getLink();
            $isExternal = false;

            if (!empty($link) && (str_starts_with($link, 'http://') || str_starts_with($link, 'https://') || str_starts_with($link, '//'))) {
                $linkHost = parse_url($link, PHP_URL_HOST);
                if ($linkHost && $requestHost && mb_strtolower((string)$linkHost) !== mb_strtolower((string)$requestHost)) {
                    $isExternal = true;
                }
            }

            $manufacturer->addExtension('ultimateCmsTools', new ArrayStruct(['isExternal' => $isExternal]));
        }

        $data = new ArrayStruct([
            'manufacturers' => $manufacturers
        ]);

        $slot->setData($data);
    }
}

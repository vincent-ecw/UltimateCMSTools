<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Category\CategoryDefinition;
use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\EntityResolverContext;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\ContainsFilter;

class SubcategoryGridCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'subcategory-grid';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        if (!$resolverContext instanceof EntityResolverContext) {
            return null;
        }

        if ($resolverContext->getDefinition()->getEntityName() !== CategoryDefinition::ENTITY_NAME) {
            return null;
        }

        $categoryId = $resolverContext->getEntity()->getId();

        $config = $slot->getFieldConfig();
        $showAllSubcategories = false;
        if ($config !== null) {
            $showAllSubcategoriesConfig = $config->get('showAllSubcategories');
            if ($showAllSubcategoriesConfig !== null) {
                $showAllSubcategories = (bool) $showAllSubcategoriesConfig->getValue();
            }
        }

        $criteria = new Criteria();
        if ($showAllSubcategories) {
            $criteria->addFilter(new ContainsFilter('path', '|' . $categoryId . '|'));
        } else {
            $criteria->addFilter(new EqualsFilter('parentId', $categoryId));
        }
        $criteria->addFilter(new EqualsFilter('active', true));
        $criteria->addAssociation('media');

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('subcategory_grid_' . $slot->getUniqueIdentifier(), CategoryDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $key = 'subcategory_grid_' . $slot->getUniqueIdentifier();
        $searchResult = $result->get($key);

        if (!$searchResult) {
            return;
        }

        $categories = $searchResult->getEntities();
        
        $data = new \Shopware\Core\Framework\Struct\ArrayStruct([
            'categories' => $categories
        ]);

        $slot->setData($data);
    }
}

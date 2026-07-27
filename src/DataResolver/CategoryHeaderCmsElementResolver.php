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
use Shopware\Core\Framework\Struct\ArrayStruct;

class CategoryHeaderCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'category-header';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $categoryId = null;

        if ($resolverContext instanceof EntityResolverContext && $resolverContext->getDefinition()->getEntityName() === CategoryDefinition::ENTITY_NAME) {
            $categoryId = $resolverContext->getEntity()->getId();
        } else {
            $request = $resolverContext->getRequest();
            if ($request && $request->attributes->has('navigationId')) {
                $categoryId = (string) $request->attributes->get('navigationId');
            }
        }

        if (!$categoryId) {
            return null;
        }

        $criteria = new Criteria([$categoryId]);
        $criteria->addAssociation('media');

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('category_header_' . $slot->getUniqueIdentifier(), CategoryDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $key = 'category_header_' . $slot->getUniqueIdentifier();
        $searchResult = $result->get($key);

        $category = null;
        if ($searchResult && $searchResult->count() > 0) {
            $category = $searchResult->first();
        }

        $slot->setData(new ArrayStruct([
            'category' => $category
        ]));
    }
}

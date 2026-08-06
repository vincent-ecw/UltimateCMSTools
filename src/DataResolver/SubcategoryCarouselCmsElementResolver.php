<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\DataResolver;

use Shopware\Core\Content\Category\CategoryCollection;
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
use Shopware\Core\Framework\DataAbstractionLayer\Util\AfterSort;

class SubcategoryCarouselCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'subcategory-carousel';
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
        $criteriaCollection->add('subcategory_carousel_' . $slot->getUniqueIdentifier(), CategoryDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $key = 'subcategory_carousel_' . $slot->getUniqueIdentifier();
        $searchResult = $result->get($key);

        if (!$searchResult) {
            return;
        }

        /** @var CategoryCollection $categories */
        $categories = $searchResult->getEntities();
        
        if ($resolverContext instanceof EntityResolverContext) {
            $categories = $this->sortCategoriesByTree($categories, $resolverContext->getEntity()->getId());
        } else {
            $categories->sortByPosition();
        }

        foreach ($categories as $category) {
            $translated = $category->getTranslated();
            if (isset($translated['description']) && is_string($translated['description'])) {
                $translated['description'] = $this->formatCategoryDescription($translated['description']);
                $category->setTranslated($translated);
            }
        }

        $data = new \Shopware\Core\Framework\Struct\ArrayStruct([
            'categories' => $categories
        ]);

        $slot->setData($data);
    }

    private function formatCategoryDescription(?string $description): string
    {
        if (!$description) {
            return '';
        }

        $text = preg_replace('/<\/(p|div|h[1-6]|li)>\s*|<br\s*\/?>/i', '||PARAGRAPH||', $description);
        $text = strip_tags($text);

        $parts = explode('||PARAGRAPH||', $text);
        $cleanParts = [];

        foreach ($parts as $part) {
            $trimmed = trim(html_entity_decode($part, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            $trimmed = trim($trimmed, " \t\n\r\0\x0B\xC2\xA0");

            if ($trimmed === '') {
                continue;
            }

            $lastChar = mb_substr($trimmed, -1);
            if (!in_array($lastChar, ['.', '!', '?', ':', ';'], true)) {
                $trimmed .= '.';
            }

            $cleanParts[] = $trimmed;
        }

        return implode(' ', $cleanParts);
    }

    private function sortCategoriesByTree(CategoryCollection $categories, string $rootCategoryId): CategoryCollection
    {
        if ($categories->count() <= 1) {
            return $categories;
        }

        $grouped = [];
        foreach ($categories as $category) {
            $parentId = $category->getParentId() ?? '';
            $grouped[$parentId][$category->getId()] = $category;
        }

        foreach ($grouped as $parentId => $children) {
            $grouped[$parentId] = AfterSort::sort($children, 'afterCategoryId');
        }

        $sortedCategories = [];
        $visited = [];

        $flatten = function (string $parentId) use (&$flatten, &$grouped, &$sortedCategories, &$visited) {
            if (!isset($grouped[$parentId])) {
                return;
            }

            foreach ($grouped[$parentId] as $categoryId => $category) {
                if (isset($visited[$categoryId])) {
                    continue;
                }
                $visited[$categoryId] = true;
                $sortedCategories[$categoryId] = $category;
                $flatten($categoryId);
            }
        };

        $flatten($rootCategoryId);

        foreach ($grouped as $parentId => $children) {
            foreach ($children as $categoryId => $category) {
                if (!isset($visited[$categoryId])) {
                    $visited[$categoryId] = true;
                    $sortedCategories[$categoryId] = $category;
                    $flatten($categoryId);
                }
            }
        }

        return new CategoryCollection($sortedCategories);
    }
}

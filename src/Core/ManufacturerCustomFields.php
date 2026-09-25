<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Core;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\System\CustomField\CustomFieldTypes;

final class ManufacturerCustomFields
{
    public const SORTING_ORDER = 'ultimate_cms_tools_manufacturer_sorting_order';

    public function __construct(
        private readonly EntityRepository $customFieldSetRepository,
        private readonly EntityRepository $customFieldRepository,
    ) {
    }

    public function ensureSortingOrder(Context $context): void
    {
        $criteria = (new Criteria())->addFilter(new EqualsFilter('name', 'ultimate_cms_tools_manufacturer'));
        $setId = $this->customFieldSetRepository->searchIds($criteria, $context)->firstId();
        if ($setId === null) {
            throw new \RuntimeException('The Ultimate CMS Tools manufacturer custom field set is missing. Run plugin migrations first.');
        }

        $criteria = (new Criteria())->addFilter(new EqualsFilter('name', self::SORTING_ORDER));
        $fieldId = $this->customFieldRepository->searchIds($criteria, $context)->firstId();
        $field = [
            'name' => self::SORTING_ORDER,
            'type' => CustomFieldTypes::INT,
            'customFieldSetId' => $setId,
            'active' => true,
            'config' => [
                'label' => ['en-GB' => 'Sorting order', 'de-DE' => 'Sortierreihenfolge', 'nl-NL' => 'Sorteervolgorde'],
                'componentName' => 'sw-number-field',
                'customFieldType' => 'number',
                'numberType' => 'int',
                'customFieldPosition' => 3,
            ],
        ];
        if ($fieldId !== null) {
            $field['id'] = $fieldId;
        }

        $this->customFieldRepository->upsert([$field], $context);
    }
}

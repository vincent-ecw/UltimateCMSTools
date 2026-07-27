<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1721000000ManufacturerCustomFields extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1721000000;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            INSERT IGNORE INTO `custom_field_set` (`id`, `name`, `config`, `active`, `global`, `created_at`) VALUES (
                UNHEX("018f1234567870008000000000000001"),
                "ultimate_cms_tools_manufacturer",
                "{\"label\": {\"en-GB\": \"Ultimate CMS Tools\", \"de-DE\": \"Ultimate CMS Tools\"}}",
                1,
                0,
                NOW(3)
            )
        ');

        $connection->executeStatement('
            INSERT IGNORE INTO `custom_field_set_relation` (`id`, `set_id`, `entity_name`, `created_at`) VALUES (
                UNHEX("018f1234567870008000000000000002"),
                UNHEX("018f1234567870008000000000000001"),
                "product_manufacturer",
                NOW(3)
            )
        ');

        $connection->executeStatement('
            INSERT IGNORE INTO `custom_field` (`id`, `name`, `type`, `config`, `active`, `set_id`, `created_at`) VALUES (
                UNHEX("018f1234567870008000000000000003"),
                "ultimate_cms_tools_show_in_grid",
                "bool",
                "{\"label\": {\"en-GB\": \"Show in Grid\", \"de-DE\": \"Im Raster anzeigen\"}, \"type\": \"switch\", \"customFieldPosition\": 1}",
                1,
                UNHEX("018f1234567870008000000000000001"),
                NOW(3)
            ), (
                UNHEX("018f1234567870008000000000000004"),
                "ultimate_cms_tools_show_in_carousel",
                "bool",
                "{\"label\": {\"en-GB\": \"Show in Carousel\", \"de-DE\": \"Im Karussell anzeigen\"}, \"type\": \"switch\", \"customFieldPosition\": 2}",
                1,
                UNHEX("018f1234567870008000000000000001"),
                NOW(3)
            )
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}

<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1721000001CategoryCustomFields extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1721000001;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            INSERT IGNORE INTO `custom_field_set` (`id`, `name`, `config`, `active`, `global`, `created_at`) VALUES (
                UNHEX("018f1234567870008000000000000005"),
                "ultimate_cms_tools_category",
                "{\"label\": {\"en-GB\": \"Ultimate CMS Tools\", \"de-DE\": \"Ultimate CMS Tools\", \"nl-NL\": \"Ultimate CMS Tools\"}}",
                1,
                0,
                NOW(3)
            )
        ');

        $connection->executeStatement('
            INSERT IGNORE INTO `custom_field_set_relation` (`id`, `set_id`, `entity_name`, `created_at`) VALUES (
                UNHEX("018f1234567870008000000000000006"),
                UNHEX("018f1234567870008000000000000005"),
                "category",
                NOW(3)
            )
        ');

        $connection->executeStatement('
            INSERT IGNORE INTO `custom_field` (`id`, `name`, `type`, `config`, `active`, `set_id`, `created_at`) VALUES (
                UNHEX("018f1234567870008000000000000007"),
                "ultimate_cms_tools_subtitle",
                "text",
                "{\"label\": {\"en-GB\": \"Subtitle\", \"de-DE\": \"Untertitel\", \"nl-NL\": \"Subtitel\"}, \"componentName\": \"sw-field\", \"type\": \"text\", \"customFieldPosition\": 1}",
                1,
                UNHEX("018f1234567870008000000000000005"),
                NOW(3)
            )
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}

<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1721000002CategoryPageTitleCustomField extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1721000002;
    }

    public function update(Connection $connection): void
    {
        // Insert custom field ultimate_cms_tools_page_title with customFieldPosition 1
        $connection->executeStatement('
            INSERT IGNORE INTO `custom_field` (`id`, `name`, `type`, `config`, `active`, `set_id`, `created_at`) VALUES (
                UNHEX("018f1234567870008000000000000008"),
                "ultimate_cms_tools_page_title",
                "text",
                "{\"label\": {\"en-GB\": \"Page title\", \"de-DE\": \"Seitentitel\", \"nl-NL\": \"Paginatitel\"}, \"componentName\": \"sw-field\", \"type\": \"text\", \"customFieldPosition\": 1}",
                1,
                UNHEX("018f1234567870008000000000000005"),
                NOW(3)
            )
        ');

        // Update ultimate_cms_tools_subtitle position to 2 so page title shows above subtitle
        $connection->executeStatement('
            UPDATE `custom_field`
            SET `config` = JSON_SET(`config`, "$.customFieldPosition", 2)
            WHERE `name` = "ultimate_cms_tools_subtitle"
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}

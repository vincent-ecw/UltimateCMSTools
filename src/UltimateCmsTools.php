<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools;

use Shopware\Core\Framework\Plugin;

class UltimateCmsTools extends Plugin
{
    public function getTemplatePriority(): int
    {
        return 100;
    }
}

<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use VincentBourgonje\UltimateCmsTools\Core\GridLayouts;
use VincentBourgonje\UltimateCmsTools\Core\GridColumnStyles;

final class GridExtension extends AbstractExtension
{
    public function __construct(
        private readonly GridLayouts $layouts,
        private readonly GridColumnStyles $styles,
    ) {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('uct_grid_columns', $this->layouts->getColumns(...)),
            // Safe fallback for direct template rendering outside the CMS loader.
            new TwigFunction('uct_grid_styles', $this->styles->getStyles(...)),
        ];
    }
}

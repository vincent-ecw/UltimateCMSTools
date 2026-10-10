<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Twig;

use VincentBourgonje\UltimateCmsTools\Core\MediaImageSourceBuilder;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

final class MediaImageExtension extends AbstractExtension
{
    public function __construct(private readonly MediaImageSourceBuilder $sources)
    {
    }

    public function getFilters(): array
    {
        return [new TwigFilter('uct_image_candidates', $this->sources->build(...))];
    }
}

<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/** Renders reviewed local SVGs only; CMS values are never interpreted as paths or markup. */
final class BundledIconExtension extends AbstractExtension
{
    /** @var array<string, array{label: string, svg: string, source: string}>|null */
    private ?array $catalog = null;

    public function getFunctions(): array
    {
        return [new TwigFunction('uct_icon', $this->render(...), ['is_safe' => ['html']])];
    }

    public function render(?string $name): string
    {
        if ($name === null || $name === '' || $name === 'none' || $name === 'custom') {
            return '';
        }

        $this->catalog ??= json_decode(
            (string) file_get_contents(__DIR__ . '/../Resources/app/shared/icons/catalog.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        $key = str_starts_with($name, 'regular-') || str_starts_with($name, 'solid-') ? $name : 'regular-' . $name;

        return ($this->catalog[$key] ?? $this->catalog['regular-question-circle'])['svg'];
    }
}

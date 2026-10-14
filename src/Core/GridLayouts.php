<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Core;

final class GridLayouts
{
    private readonly array $layouts;

    public function __construct()
    {
        $this->layouts = json_decode((string) file_get_contents(__DIR__ . '/../Resources/app/shared/grid-layouts.json'), true, 512, JSON_THROW_ON_ERROR);
    }

    public function getTypes(): array
    {
        return array_keys($this->layouts);
    }

    public function has(string $type): bool
    {
        return isset($this->layouts[$type]);
    }

    public function getColumns(string $type): array
    {
        $widths = $this->layouts[$type]['widths'] ?? [];
        return array_map(static fn (int $width, int $offset): array => [
            'index' => $offset + 1,
            'class' => $width === 12 ? 'col-12' : 'col-12 col-md-' . $width,
            'label' => round($width / 12 * 100) . '%',
            'width' => $width,
        ], $widths, array_keys($widths));
    }
}

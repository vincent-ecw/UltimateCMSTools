<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use VincentBourgonje\UltimateCmsTools\Core\GridLayouts;

require_once __DIR__ . '/../../src/Core/GridLayouts.php';

final class GridThumbnailContextTest extends TestCase
{
    public function testEveryLayoutPassesNumericColumnRatiosToChildElements(): void
    {
        $root = dirname(__DIR__, 2) . '/src/Resources/views/storefront/block/';
        $templates = [];
        foreach (glob($root . 'cms-block-uct-grid-*.html.twig') as $file) {
            // Use native includes to test context propagation without a Shopware kernel.
            $templates['@Storefront/storefront/block/' . basename($file)] = str_replace('sw_include', 'include', file_get_contents($file));
        }
        $templates['@Storefront/storefront/element/cms-element-image.html.twig'] = '[{{ (100 / columns)|round(0, "ceil") }}]';
        $twig = new \Twig\Environment(new \Twig\Loader\ArrayLoader($templates));
        $layouts = new GridLayouts();
        $twig->addFunction(new \Twig\TwigFunction('uct_grid_columns', $layouts->getColumns(...)));
        $twig->addFunction(new \Twig\TwigFunction('uct_grid_styles', static fn () => ''));

        foreach ($layouts->getTypes() as $type) {
            $slots = [];
            foreach ($layouts->getColumns($type) as $column) {
                $slots[] = ['slot' => 'content' . $column['index'], 'id' => 'image-' . $column['index'], 'type' => 'image'];
            }
            $html = $twig->render('@Storefront/storefront/block/cms-block-' . $type . '.html.twig', [
                'block' => ['slots' => $slots, 'customFields' => [], 'extensions' => []],
            ]);
            preg_match_all('/\[(\d+)\]/', $html, $matches);
            self::assertSame(array_map(static fn (array $col) => (string) ceil(100 * $col['width'] / 12), $layouts->getColumns($type)), $matches[1], $type);
        }
    }
}

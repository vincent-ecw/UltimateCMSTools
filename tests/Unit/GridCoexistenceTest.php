<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\Adapter\Twig\TemplateFinder;
use VincentBourgonje\UltimateCmsTools\Core\GridLayouts;

require_once __DIR__ . '/../../src/Core/GridLayouts.php';

final class GridCoexistenceTest extends TestCase
{
    public function testLegacyAndNewTemplatesHaveIndependentResolution(): void
    {
        $root = \dirname(__DIR__, 2);
        $legacyRoot = \dirname($root) . '/SschreierGridLayoutForShoppingExperiences-1.1.1/src/Resources/views';
        if (!is_dir($legacyRoot)) {
            self::markTestSkipped('Optional legacy plugin is unavailable.');
        }
        $loader = new \Twig\Loader\FilesystemLoader();
        $loader->addPath($root . '/src/Resources/views', 'UltimateCmsTools');
        $loader->addPath($legacyRoot, 'SschreierGridLayoutForShoppingExperiences');
        $theme = new \Twig\Loader\ArrayLoader([
            '@AuditTheme/storefront/block/cms-block-grid-md-6-6.html.twig' => 'legacy theme',
            '@AuditTheme/storefront/block/cms-block-uct-grid-md-6-6.html.twig' => 'new theme',
        ]);
        $chain = new \Twig\Loader\ChainLoader([$theme, $loader]);
        $twig = new \Twig\Environment($chain);
        $hierarchy = $this->createMock(\Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\NamespaceHierarchyBuilder::class);
        $hierarchy->method('buildHierarchy')->willReturnOnConsecutiveCalls(
            ['SschreierGridLayoutForShoppingExperiences' => 0, 'UltimateCmsTools' => 0],
            ['AuditTheme' => 1, 'SschreierGridLayoutForShoppingExperiences' => 0, 'UltimateCmsTools' => 0],
        );
        $scope = $this->createMock(\Shopware\Core\Framework\Adapter\Twig\TemplateScopeDetector::class);
        $scope->method('getScopes')->willReturn([]);
        $finder = new TemplateFinder($twig, $chain, sys_get_temp_dir() . '/uct-grid-coexistence-cache', $hierarchy, $scope);
        foreach ((new GridLayouts())->getTypes() as $type) {
            $legacy = substr($type, 4);
            $legacyPath = 'storefront/block/cms-block-' . $legacy . '.html.twig';
            $newPath = 'storefront/block/cms-block-' . $type . '.html.twig';
            self::assertSame('@SschreierGridLayoutForShoppingExperiences/' . $legacyPath, $finder->find('@Storefront/' . $legacyPath));
            self::assertSame('@UltimateCmsTools/' . $newPath, $finder->find('@Storefront/' . $newPath));
            self::assertFalse($loader->exists('@UltimateCmsTools/' . $legacyPath));
        }
        $finder->reset();
        foreach (['grid-md-6-6', 'uct-grid-md-6-6'] as $type) {
            $path = 'storefront/block/cms-block-' . $type . '.html.twig';
            self::assertSame('@AuditTheme/' . $path, $finder->find('@Storefront/' . $path));
        }
    }

    public function testCatalogOwnsOnlyNamespacedBootstrapLayouts(): void
    {
        $layouts = new GridLayouts();
        self::assertCount(11, $layouts->getTypes());
        foreach ($layouts->getTypes() as $type) {
            self::assertStringStartsWith('uct-grid-', $type);
            self::assertSame(12, array_sum(array_column($layouts->getColumns($type), 'width')));
            self::assertFalse($layouts->has(substr($type, 4)));
        }
        self::assertSame([], $layouts->getColumns('grid-md-6-6'));
    }
}

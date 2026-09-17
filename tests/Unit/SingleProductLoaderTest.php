<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Content\Product\SalesChannel\Detail\AbstractProductDetailRoute;
use Shopware\Core\Content\Product\SalesChannel\Detail\ProductDetailRouteResponse;
use Shopware\Core\Content\Product\SalesChannel\FindVariant\AbstractFindProductVariantRoute;
use Shopware\Core\Content\Product\SalesChannel\FindVariant\FindProductVariantRouteResponse;
use Shopware\Core\Content\Product\SalesChannel\FindVariant\FoundCombination;
use Shopware\Core\Content\Product\SalesChannel\SalesChannelProductEntity;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\Request;
use VincentBourgonje\UltimateCmsTools\Core\SingleProductLoader;

require_once __DIR__ . '/../../src/Core/SingleProductLoader.php';

final class SingleProductLoaderTest extends TestCase
{
    public function testParentAndVariantPurchaseRules(): void
    {
        foreach ([
            ['parent', 'parent', false, true],
            ['parent', 'parent', true, false],
            ['variant', 'parent', false, false],
            ['simple', null, false, false],
        ] as [$configuredId, $parentId, $showVariants, $requiresSelection]) {
            $product = new SalesChannelProductEntity();
            $product->setParentId($parentId);
            $product->setChildCount(0);
            $detail = $this->createMock(AbstractProductDetailRoute::class);
            $detail->method('load')->willReturn(new ProductDetailRouteResponse($product, null));
            $variant = $this->createMock(AbstractFindProductVariantRoute::class);
            $result = (new SingleProductLoader($detail, $variant))->load($configuredId, $showVariants, $this->createMock(SalesChannelContext::class));
            self::assertSame($requiresSelection, $result->get('requiresSelection'));
        }
    }

    public function testProductPageRecursionIsDisabledAndVariantControlsAreOptional(): void
    {
        $product = new SalesChannelProductEntity();
        $detail = $this->createMock(AbstractProductDetailRoute::class);
        $detail->expects(self::once())->method('load')->with('product', self::callback(static function (Request $request): bool {
            return $request->query->getBoolean('skipCmsPage') && $request->query->getBoolean('skipConfigurator');
        }), self::anything(), self::anything())->willReturn(new ProductDetailRouteResponse($product, null));
        $variant = $this->createMock(AbstractFindProductVariantRoute::class);
        $variant->expects(self::never())->method('load');
        $result = (new SingleProductLoader($detail, $variant))->load('product', false, $this->createMock(SalesChannelContext::class));
        self::assertSame($product, $result->get('product'));
        self::assertFalse($result->get('showVariants'));
        self::assertNull($result->get('configurator'));
    }

    public function testSelectedVariantIsReloadedWithContextualProductData(): void
    {
        $initial = new SalesChannelProductEntity();
        $initial->setParentId('parent');
        $selected = new SalesChannelProductEntity();
        $detail = $this->createMock(AbstractProductDetailRoute::class);
        $ids = [];
        $detail->expects(self::exactly(2))->method('load')->willReturnCallback(static function (string $id, Request $request) use (&$ids, $initial, $selected): ProductDetailRouteResponse {
            $ids[] = $id;
            self::assertTrue($request->query->getBoolean('skipCmsPage'));
            self::assertFalse($request->query->getBoolean('skipConfigurator'));
            return new ProductDetailRouteResponse(count($ids) === 1 ? $initial : $selected, null);
        });
        $variant = $this->createMock(AbstractFindProductVariantRoute::class);
        $variant->expects(self::once())->method('load')->with('parent', self::callback(static function (Request $request): bool {
            return $request->query->all('options') === ['color' => 'blue'] && $request->query->get('switchedGroup') === 'color';
        }), self::anything())->willReturn(new FindProductVariantRouteResponse(new FoundCombination('selected', ['color' => 'blue'])));
        $result = (new SingleProductLoader($detail, $variant))->load('initial', true, $this->createMock(SalesChannelContext::class), ['color' => 'blue'], 'color');
        self::assertSame(['initial', 'selected'], $ids);
        self::assertSame($selected, $result->get('product'));
    }
}

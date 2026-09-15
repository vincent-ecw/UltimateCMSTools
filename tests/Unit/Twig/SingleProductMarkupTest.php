<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit\Twig;

use PHPUnit\Framework\TestCase;
use Twig\Environment;
use Twig\Loader\ArrayLoader;
use Twig\TwigFilter;

final class SingleProductMarkupTest extends TestCase
{
    public function testThemeWrapperAcrossPriceAndActionBlocksRemainsBalanced(): void
    {
        $root = __DIR__ . '/../../../src/Resources/views/storefront/component/';
        $card = str_replace('sw_extends', 'extends', file_get_contents($root . 'uct-single-product/card.html.twig'));
        $action = str_replace('sw_extends', 'extends', file_get_contents($root . 'product/card/action.html.twig'));
        $twig = new Environment(new ArrayLoader([
            'card' => $card,
            'action' => $action,
            '@Storefront/storefront/component/product/card/box-standard.html.twig' => '<div class="product-box">{% block component_product_box_price %}<div class="price-action">PRICE{% endblock %}{% block component_product_box_action %}{% include "action" %}</div>{% endblock %}</div>',
            '@Storefront/storefront/component/product/card/action.html.twig' => '<div class="product-action">{% block component_product_box_action_buttons %}LISTING{% endblock %}</div>{% if false %}{% block component_product_box_action_buy %}<form>{{ block("component_product_box_action_buy_button") }}</form>{% endblock %}{% block component_product_box_action_buy_button %}DEFAULT BUTTON{% endblock %}{% block component_product_box_action_detail %}DETAILS{% endblock %}{% endif %}',
        ]));
        $twig->addFilter(new TwigFilter('trans', static fn (string $key): string => 'Add to cart'));
        $twig->addFilter(new TwigFilter('sw_sanitize', static fn (string $value): string => $value));
        foreach ([true, false] as $available) {
            $html = $twig->render('card', ['product' => ['available' => $available, 'childCount' => 0, 'calculatedMaxPurchase' => 10, 'minPurchase' => 1]]);
            self::assertSame(substr_count($html, '<div'), substr_count($html, '</div>'));
            self::assertStringContainsString('price-action', $html);
            self::assertSame($available, str_contains($html, '<form>'));
            self::assertStringNotContainsString('LISTING', $html);
        }
        self::assertStringContainsString('LISTING', $twig->render('action'));
        self::assertStringNotContainsString('<form>', $twig->render('action'));
    }
}

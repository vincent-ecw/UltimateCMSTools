<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use VincentBourgonje\UltimateCmsTools\Twig\BundledIconExtension;

require_once __DIR__ . '/../../src/Twig/BundledIconExtension.php';

final class BundledIconExtensionTest extends TestCase
{
    public function testEveryOfferedIconIsValidDecorativeSvg(): void
    {
        $catalog = json_decode((string) file_get_contents(__DIR__ . '/../../src/Resources/app/shared/icons/catalog.json'), true, 512, JSON_THROW_ON_ERROR);
        $extension = new BundledIconExtension();
        self::assertGreaterThan(100, count($catalog));
        foreach ($catalog as $name => $icon) {
            $svg = $extension->render($name);
            self::assertSame($icon['svg'], $svg, $name);
            $document = new \DOMDocument();
            self::assertTrue($document->loadXML($svg), $name);
            self::assertSame('svg', $document->documentElement->tagName);
            self::assertSame('true', $document->documentElement->getAttribute('aria-hidden'));
            self::assertSame('false', $document->documentElement->getAttribute('focusable'));
            self::assertNotEmpty($document->documentElement->getAttribute('viewBox'));
            foreach ($document->getElementsByTagName('*') as $element) {
                self::assertContains($element->localName, ['svg', 'path', 'g', 'circle', 'rect', 'ellipse', 'polygon', 'polyline', 'line']);
                foreach ($element->attributes as $attribute) {
                    self::assertFalse(str_starts_with(strtolower($attribute->name), 'on'));
                    self::assertNotContains($attribute->name, ['id', 'href', 'xlink:href', 'style']);
                }
            }
        }
    }

    public function testTemplateOutputsSvgAndEscapesConfiguredClasses(): void
    {
        $twig = new \Twig\Environment(new \Twig\Loader\FilesystemLoader(__DIR__ . '/../../src/Resources/views/storefront/utilities'), ['autoescape' => 'html']);
        $twig->addExtension(new BundledIconExtension());
        $html = $twig->render('uct-icon.html.twig', ['name' => 'regular-rocket', 'iconClass' => '" onclick="alert(1)']);
        self::assertStringContainsString('<svg', $html);
        self::assertStringNotContainsString('&lt;svg', $html);
        self::assertStringContainsString('&quot;', $html);
        self::assertSame('', trim($twig->render('uct-icon.html.twig', ['name' => 'none'])));
    }

    public function testLegacyAliasesVariantsAndUntrustedNames(): void
    {
        $extension = new BundledIconExtension();
        foreach (['arrow-right', 'arrow-left', 'chart', 'shop', 'thumb-up'] as $name) {
            self::assertStringContainsString('<svg', $extension->render('regular-' . $name));
            self::assertSame($extension->render('regular-' . $name), $extension->render($name));
        }
        self::assertNotSame($extension->render('regular-heart'), $extension->render('solid-heart'));
        foreach ([null, '', 'none', 'custom'] as $name) self::assertSame('', $extension->render($name));
        foreach (['../../composer.json', '<script>alert(1)</script>', 'https://example.com/icon.svg', 'unknown-icon'] as $name) {
            self::assertSame($extension->render('regular-question-circle'), $extension->render($name));
        }
    }
}

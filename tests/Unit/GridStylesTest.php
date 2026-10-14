<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use VincentBourgonje\UltimateCmsTools\Core\GridColumnStyles;

require_once __DIR__ . '/../../src/Core/GridColumnStyles.php';

final class GridStylesTest extends TestCase
{
    public function testSafeStylesAndImageModes(): void
    {
        $extension = new GridColumnStyles();
        $styles = $extension->getStyles([
            'padding' => 'calc(1rem + 2px) 24px',
            'backgroundColor' => 'rgba(12, 34, 56, 0.5)',
            'backgroundMediaUrl' => 'https://example.com/media/image.jpg',
            'backgroundMediaMode' => 'contain',
        ]);
        self::assertStringContainsString('padding: calc(1rem + 2px) 24px;', $styles);
        self::assertStringContainsString('background-color: rgba(12, 34, 56, 0.5);', $styles);
        self::assertStringContainsString('background-size: contain;', $styles);
        self::assertStringContainsString('background-size: cover;', $extension->getStyles([
            'backgroundMediaUrl' => '/media/image.jpg', 'backgroundMediaMode' => 'cover; position: fixed',
        ]));
    }

    public function testUntrustedValuesCannotEscapeTheirDeclarations(): void
    {
        $extension = new GridColumnStyles();
        foreach (['0;position:fixed', 'url(https://example.com)', 'expression(alert(1))', '0" onclick="alert(1)', "0\n;color:red", 'var(--x); color:red', ['bad']] as $value) {
            self::assertSame('', $extension->getStyles(['padding' => $value, 'backgroundColor' => $value]));
        }
        foreach (['javascript:alert(1)', 'data:image/svg+xml,evil', '//example.com/image.jpg', 'https://example.com/"); color:red;/*', "https://example.com/a\n.jpg"] as $url) {
            self::assertSame('', $extension->getStyles(['backgroundMediaUrl' => $url]));
        }
        self::assertSame('', $extension->getStyles(null));
        self::assertSame('', $extension->getStyles([
            'backgroundMediaId' => 'invalid', 'backgroundMediaUrl' => '/stale.jpg',
        ]));
    }
}

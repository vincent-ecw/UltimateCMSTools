<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit\Twig;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Twig\Environment;
use Twig\Loader\ArrayLoader;
use VincentBourgonje\UltimateCmsTools\Twig\CmsSecurityExtension;

require_once __DIR__ . '/../../../src/Twig/CmsSecurityExtension.php';

final class CmsSecurityExtensionTest extends TestCase
{
    #[DataProvider('safeLinks')]
    public function testSafeLinksRemainUsable(string $url): void
    {
        static::assertSame($url, CmsSecurityExtension::safeUrl($url));
    }

    public static function safeLinks(): iterable
    {
        yield ['/category/example'];
        yield ['https://example.com/path?x=1'];
        yield ['//example.com/path'];
        yield ['mailto:hello@example.com'];
        yield ['tel:+31201234567'];
        yield ['#details'];
    }

    #[DataProvider('unsafeLinks')]
    public function testExecutableOrMalformedLinksAreRejected(string $url): void
    {
        static::assertSame('', CmsSecurityExtension::safeUrl($url));
    }

    public static function unsafeLinks(): iterable
    {
        yield ['javascript:alert(1)'];
        yield ["java\nscript:alert(1)"];
        yield ['data:text/html,<script>alert(1)</script>'];
        yield ['https://example.com\\@evil.test/path'];
        yield ['https://user@example.com/path'];
        yield ['//user@example.com/path'];
        yield ['https://example.com/space here'];
    }

    public function testInlineCssValuesRejectDeclarationBreakouts(): void
    {
        static::assertSame('500px', CmsSecurityExtension::safeCssLength('500'));
        static::assertSame('20rem', CmsSecurityExtension::safeCssLength('20rem'));
        static::assertSame('', CmsSecurityExtension::safeCssLength('20px;background:red'));
        static::assertSame('', CmsSecurityExtension::safeCssLength('9999px'));
        static::assertSame('#aabbcc', CmsSecurityExtension::safeCssColor('#aabbcc'));
        static::assertSame('rgba(12, 34, 56, 0.5)', CmsSecurityExtension::safeCssColor('rgba(12, 34, 56, 0.5)'));
        static::assertSame('', CmsSecurityExtension::safeCssColor('rgb(999, 0, 0)'));
        static::assertSame('', CmsSecurityExtension::safeCssColor('red;display:none'));
        static::assertSame('/image.jpg', CmsSecurityExtension::safeCssUrl('/image.jpg'));
        static::assertSame('', CmsSecurityExtension::safeCssUrl('/image.jpg);color:red'));
    }

    public function testCarouselNumbersAreBounded(): void
    {
        static::assertSame(24, CmsSecurityExtension::boundedInt('999999999', 1, 24, 10));
        static::assertSame(10, CmsSecurityExtension::boundedInt('1;alert(1)', 1, 24, 10));
    }

    public function testFaqJsonLdCannotTerminateItsScriptElement(): void
    {
        $source = file_get_contents(__DIR__ . '/../../../src/Resources/views/storefront/element/cms-element-faq-harmonica.html.twig');
        static::assertIsString($source);
        static::assertSame(1, preg_match('/\{\{\s*faqSchema\|json_encode.*?\|raw\s*\}\}/s', $source, $match));

        $twig = new Environment(new ArrayLoader([
            'faq-schema' => '<script type="application/ld+json">' . $match[0] . '</script>',
        ]));
        $output = $twig->render('faq-schema', ['faqSchema' => ['text' => '</script><script>alert(1)</script>']]);

        static::assertSame(1, substr_count($output, '</script>'));
        static::assertStringNotContainsString('</script><script>', $output);
        static::assertStringContainsString('\\u003C\\/script\\u003E', $output);
    }
}

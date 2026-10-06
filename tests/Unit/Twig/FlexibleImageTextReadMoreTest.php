<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit\Twig;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\Adapter\Twig\Extension\SwSanitizeTwigFilter;
use Shopware\Core\Framework\Util\HtmlSanitizer;
use Shopware\Storefront\Framework\Twig\TokenParser\ThumbnailTokenParser;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\TwigFilter;
use VincentBourgonje\UltimateCmsTools\Twig\CmsSecurityExtension;

require_once __DIR__ . '/../../../src/Twig/CmsSecurityExtension.php';

final class FlexibleImageTextReadMoreTest extends TestCase
{
    public function testSanitizedContentBelowLayoutAcrossThemes(): void
    {
        foreach (['traditional', 'polaroid', 'offset', 'rounded', 'stacked'] as $theme) {
            $html = $this->render([
                'theme' => ['value' => $theme],
                'readMoreText' => ['value' => '<p><strong>More details</strong> <a href="javascript:alert(1)" onclick="alert(1)">Link</a></p><script>alert(1)</script>'],
                'readMoreMaxWidth' => ['value' => '80%'],
            ]);
            self::assertStringContainsString('<strong>More details</strong>', $html);
            self::assertStringNotContainsString('<script>', $html);
            self::assertStringNotContainsString('javascript:', $html);
            self::assertStringNotContainsString('onclick', $html);
            self::assertStringContainsString('style="max-width: 80%;"', $html);
            self::assertStringContainsString('aria-expanded="false"', $html);
            self::assertStringContainsString('aria-hidden="true" inert', $html);
            self::assertStringContainsString('aria-controls="uct-read-more-example"', $html);
            $dom = new \DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new \DOMXPath($dom);
            self::assertSame(1, $xpath->query('//div[contains(@class, "flexible-image-text__container")]/following-sibling::div[@data-uct-read-more]')->length);
        }
    }

    public function testEmptyOrAbsentTextDoesNotProduceToggle(): void
    {
        foreach ([null, '', '<p><br></p>', '<p>&nbsp;</p>', '<script>alert(1)</script>'] as $text) {
            self::assertStringNotContainsString('data-uct-read-more', $this->render(['readMoreText' => ['value' => $text]]));
        }
        self::assertStringNotContainsString('data-uct-read-more', $this->render([]));
    }

    public function testButtonFollowsContentAndStyleIsAllowlisted(): void
    {
        foreach (['primary', 'secondary', 'outline-primary', 'outline-secondary', 'light', 'dark', 'link', 'invalid" onclick="alert(1)', ''] as $style) {
            $html = $this->render([
                'readMoreText' => ['value' => '<p>Details</p>'],
                'readMoreButtonStyle' => ['value' => $style],
            ]);
            $expected = in_array($style, ['primary', 'secondary', 'outline-primary', 'outline-secondary', 'light', 'dark', 'link'], true) ? $style : 'primary';
            self::assertStringContainsString('class="btn btn-' . $expected . ' uct-read-more__toggle"', $html);
            self::assertStringNotContainsString('onclick', $html);
            $dom = new \DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new \DOMXPath($dom);
            self::assertSame(1, $xpath->query('//div[@data-uct-read-more-panel]/following-sibling::div[@class="uct-read-more__actions"]')->length);
        }
    }

    public function testWidthValidation(): void
    {
        foreach (['800' => '800px', '800px' => '800px', '80%' => '80%', '33.33%' => '33.33%', '10000px' => '10000px'] as $value => $expected) {
            self::assertSame($expected, CmsSecurityExtension::safeReadMoreWidth((string) $value));
        }
        foreach (['0', '-1px', '101%', '10001px', '80%;color:red', 'calc(100% - 1px)', '10rem', '" onmouseover="alert(1)'] as $value) {
            self::assertSame('', CmsSecurityExtension::safeReadMoreWidth($value));
            $html = $this->render(['readMoreText' => ['value' => '<p>Details</p>'], 'readMoreMaxWidth' => ['value' => $value]]);
            self::assertStringNotContainsString('style="max-width:', $html);
        }
    }

    private function render(array $config): string
    {
        $twig = new Environment(new FilesystemLoader(__DIR__ . '/../../../src/Resources/views/storefront/element'), ['autoescape' => 'html']);
        $twig->addExtension(new CmsSecurityExtension());
        $twig->addExtension(new SwSanitizeTwigFilter(new HtmlSanitizer(cacheEnabled: false, sets: ['basic' => [
            'tags' => ['p', 'strong', 'a', 'br'], 'attributes' => ['href'],
        ]])));
        $twig->addTokenParser(new ThumbnailTokenParser());
        $twig->addFilter(new TwigFilter('trans', static fn (string $key): string => $key));
        return $twig->render('cms-element-flexible-image-text.html.twig', ['element' => [
            'id' => 'example', 'fieldConfig' => ['elements' => $config], 'data' => null,
        ]]);
    }
}

<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit\Twig;

use PHPUnit\Framework\TestCase;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\TwigFilter;

final class AlertElementTest extends TestCase
{
    public function testMessageSanitizingTypesAndDismissal(): void
    {
        $twig = new Environment(new FilesystemLoader(__DIR__ . '/../../../src/Resources/views/storefront/element'), ['autoescape' => 'html']);
        $twig->addFilter(new TwigFilter('trans', static fn (string $key): string => 'Close message'));
        $twig->addExtension(new \Shopware\Core\Framework\Adapter\Twig\Extension\SwSanitizeTwigFilter(
            new \Shopware\Core\Framework\Util\HtmlSanitizer(cacheEnabled: false),
        ));
        foreach (['success', 'warning', 'error', 'info', 'invalid" onclick="alert(1)'] as $type) {
            foreach ([false, true] as $dismissible) {
                $output = $twig->render('cms-element-uct-alert.html.twig', ['element' => ['config' => [
                    'message' => ['value' => '<b>Bold</b> <i>Italic</i> <a href="https://example.com">Link</a><script>alert(1)</script><a href="javascript:alert(1)" onclick="alert(1)">Unsafe</a>'],
                    'type' => ['value' => $type],
                    'dismissible' => ['value' => $dismissible],
                ]]]);
                $expectedType = str_starts_with($type, 'invalid') ? 'info' : $type;
                static::assertStringContainsString('uct-alert--' . $expectedType, $output);
                static::assertStringContainsString('<b>Bold</b>', $output);
                static::assertStringContainsString('<i>Italic</i>', $output);
                static::assertStringContainsString('href="https://example.com"', $output);
                static::assertStringNotContainsString('javascript:', $output);
                static::assertStringNotContainsString('<script>', $output);
                static::assertStringNotContainsString('onclick', $output);
                static::assertSame($dismissible, str_contains($output, 'data-uct-alert-close'));
            }
        }

        static::assertSame('', trim($twig->render('cms-element-uct-alert.html.twig', ['element' => ['config' => ['message' => ['value' => " \n "]]]])));
        static::assertSame('', trim($twig->render('cms-element-uct-alert.html.twig', ['element' => ['config' => ['message' => ['value' => '<p><br></p>']]]])));
    }
}

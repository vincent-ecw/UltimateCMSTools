<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit\Twig;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\Adapter\Twig\Extension\SwSanitizeTwigFilter;
use Shopware\Core\Framework\Util\HtmlSanitizer;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\TwigFunction;

final class SurroundingTextTest extends TestCase
{
    private function renderText(array $config, string $position, mixed $spacing = null): string
    {
        $twig = new Environment(new FilesystemLoader(__DIR__ . '/../../../src/Resources/views/storefront/utilities'), ['autoescape' => 'html']);
        $configuration = \Symfony\Component\Yaml\Yaml::parseFile(dirname((new \ReflectionClass(HtmlSanitizer::class))->getFileName(), 2) . '/Resources/config/packages/shopware.yaml');
        $basic = array_values(array_filter($configuration['shopware']['html_sanitizer']['sets'], static fn (array $set): bool => $set['name'] === 'basic'))[0];
        unset($basic['options']);
        $twig->addExtension(new SwSanitizeTwigFilter(new HtmlSanitizer(cacheEnabled: false, sets: ['basic' => $basic])));
        $twig->addFunction(new TwigFunction('config', static fn (string $key): mixed => $spacing));
        return $twig->render('uct-surrounding-text.html.twig', ['element' => ['config' => $config], 'position' => $position]);
    }

    public function testLanguageResolvedConfigAndFieldSeparation(): void
    {
        foreach ([['Hello', 'Goodbye'], ['Hallo', 'Tot ziens'], ['Willkommen', 'Auf Wiedersehen']] as [$intro, $outro]) {
            $config = ['uctIntroText' => ['value' => '<h2>' . $intro . '</h2>'], 'uctOutroText' => ['value' => '<p>' . $outro . '</p>']];
            $html = $this->renderText($config, 'intro');
            static::assertStringContainsString('<h2>' . $intro . '</h2>', $html);
            static::assertStringNotContainsString($outro, $html);
            static::assertStringContainsString('<p>' . $outro . '</p>', $this->renderText($config, 'outro'));
        }
    }

    public function testEmptyContentProducesNoMarkup(): void
    {
        foreach (['', ' ', '<p><br></p>', '<p>&nbsp;</p>', '<p>&#160;</p>', '<script>alert(1)</script>'] as $empty) {
            static::assertSame('', trim($this->renderText(['uctIntroText' => ['value' => $empty]], 'intro')));
        }
        static::assertSame('', trim($this->renderText([], 'intro')));
        static::assertSame('', trim($this->renderText([], 'outro')));
    }

    public function testSanitizationAndSpacingBounds(): void
    {
        $html = $this->renderText(['uctIntroText' => ['value' => '<h2>Safe</h2><script>alert(1)</script><a href="javascript:alert(1)" onclick="alert(1)">Link</a>']], 'intro', '0; color:red');
        static::assertStringContainsString('<h2>Safe</h2>', $html);
        foreach (['<script', 'onclick', 'javascript:', 'color:red'] as $unsafe) static::assertStringNotContainsString($unsafe, $html);
        foreach ([[null, 24], [0, 0], [36, 36], [1001, 1000], [-1, 24], ['invalid', 24]] as [$input, $expected]) {
            static::assertStringContainsString('--uct-text-spacing: ' . $expected . 'px;', $this->renderText(['uctIntroText' => ['value' => 'Intro']], 'intro', $input));
        }
    }

    public function testAllPluginElementsUseTranslatedDefaultsAndBothRenderPositions(): void
    {
        foreach (glob(__DIR__ . '/../../../src/Resources/app/administration/src/module/sw-cms/elements/*', GLOB_ONLYDIR) as $directory) {
            $name = basename($directory);
            $registration = file_get_contents($directory . '/index.js');
            static::assertStringContainsString("uctIntroText: { source: 'static', value: '' }", $registration);
            static::assertStringContainsString("uctOutroText: { source: 'static', value: '' }", $registration);
            $template = file_get_contents(__DIR__ . '/../../../src/Resources/views/storefront/element/cms-element-' . $name . '.html.twig');
            static::assertStringContainsString("position: 'intro'", $template);
            static::assertStringContainsString("position: 'outro'", $template);
            $configuration = file_get_contents(glob($directory . '/config/*.html.twig')[0]);
            static::assertStringContainsString('name="intro-outro"', $configuration);
            static::assertStringContainsString('v-model:intro="uctIntroText"', $configuration);
            static::assertStringContainsString('v-model:outro="uctOutroText"', $configuration);
        }
    }
}

<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit\Twig;

use PHPUnit\Framework\TestCase;
use Twig\Environment;
use Twig\Loader\ArrayLoader;

final class SectionVisibilityTest extends TestCase
{
    public function testSectionVisibilityForVisitorAndCustomerGroups(): void
    {
        $source = file_get_contents(__DIR__ . '/../../../src/Resources/views/storefront/page/content/detail.html.twig');
        $source = str_replace(['sw_extends', 'sw_include'], ['extends', 'include'], $source);
        $twig = new Environment(new ArrayLoader([
            'section' => $source,
            '@Storefront/storefront/page/content/detail.html.twig' => '{% block page_content_section %}VISIBLE{% endblock %}',
        ]));
        // The empty-content branch is not used by this visibility matrix.
        foreach (['uct_css_color', 'uct_css_url'] as $filter) {
            $twig->addFilter(new \Twig\TwigFilter($filter, static fn ($value) => $value));
        }

        $visitors = [null, ['guest' => true, 'groupId' => 'A'], ['guest' => false, 'groupId' => 'A'], ['guest' => false, 'groupId' => 'B']];
        $cases = [
            [[], [true, true, true, true]],
            [['uct_login_status' => 'all'], [true, true, true, true]],
            [['uct_login_status' => 'logged-in'], [false, false, true, true]],
            [['uct_login_status' => 'logged-out'], [true, true, false, false]],
            [['uct_login_status' => 'logged-in', 'uct_customer_group_id' => 'A'], [false, false, true, false]],
            [['uct_customer_group_id' => 'A'], [false, false, true, false]],
            [['uct_login_status' => 'logged-out', 'uct_customer_group_id' => 'A'], [true, true, false, false]],
            [['uct_login_status' => 'all', 'uct_customer_group_id' => 'A'], [true, true, true, true]],
        ];
        foreach ($cases as [$fields, $expected]) {
            foreach ($visitors as $index => $customer) {
                $output = $twig->render('section', [
                    'section' => ['customFields' => $fields],
                    'context' => ['customer' => $customer],
                ]);
                static::assertSame($expected[$index], str_contains($output, 'VISIBLE'), json_encode([$fields, $customer]));
            }
        }
    }
}

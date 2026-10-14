<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\Routing\Attribute\Route;
use VincentBourgonje\UltimateCmsTools\Controller\GridBuilderSettingsController;

require_once __DIR__ . '/../../src/Controller/GridBuilderSettingsController.php';

final class GridBuilderSettingsTest extends TestCase
{
    public function testEndpointExposesOnlyTheGlobalBoolean(): void
    {
        $config = $this->createMock(SystemConfigService::class);
        $config->expects(self::once())->method('getBool')->with('UltimateCmsTools.config.enableGridBuilder')->willReturn(true);
        self::assertSame(['enabled' => true], json_decode((new GridBuilderSettingsController($config))->load()->getContent(), true));
    }

    public function testRouteRequiresCmsReadPermissionAndCannotWrite(): void
    {
        $reflection = new \ReflectionClass(GridBuilderSettingsController::class);
        $classRoute = $reflection->getAttributes(Route::class)[0]->newInstance();
        self::assertSame(['api'], $classRoute->getDefaults()['_routeScope']);
        self::assertSame(['cms_page:read'], $classRoute->getDefaults()['_acl']);
        $methodRoute = $reflection->getMethod('load')->getAttributes(Route::class)[0]->newInstance();
        self::assertSame(['GET'], $methodRoute->getMethods());
    }
}

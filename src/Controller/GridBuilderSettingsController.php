<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Controller;

use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['api'], '_acl' => ['cms_page:read']])]
final class GridBuilderSettingsController
{
    public function __construct(private readonly SystemConfigService $config)
    {
    }

    #[Route(path: '/api/_action/uct/grid-builder-settings', name: 'api.action.uct.grid_builder_settings', methods: ['GET'])]
    public function load(): JsonResponse
    {
        // Only this non-sensitive global flag; no arbitrary configuration access.
        return new JsonResponse(['enabled' => $this->config->getBool('UltimateCmsTools.config.enableGridBuilder')]);
    }
}

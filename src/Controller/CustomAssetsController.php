<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Controller;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\Api\Context\AdminApiSource;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Attribute\Route;
use VincentBourgonje\UltimateCmsTools\Core\CustomAssetsService;

#[Route(defaults: ['_routeScope' => ['api'], '_acl' => ['admin']])]
final class CustomAssetsController
{
    public function __construct(private readonly CustomAssetsService $assets) {}

    #[Route(path: '/api/_action/uct/custom-assets/{id}', name: 'api.action.uct.custom_assets.load', methods: ['GET'])]
    public function load(string $id, Context $context): JsonResponse
    {
        $this->requireAdministrator($context);
        return new JsonResponse($this->assets->load($id, $context));
    }

    #[Route(path: '/api/_action/uct/custom-assets', name: 'api.action.uct.custom_assets.publish', methods: ['POST'])]
    public function publish(Request $request, Context $context): JsonResponse
    {
        $this->requireAdministrator($context);
        $data = $request->toArray();
        if (!is_array($data['salesChannelIds'] ?? null)) {
            throw new BadRequestHttpException('Sales channel IDs are required.');
        }
        $this->assets->publish($data['salesChannelIds'], $data['css'] ?? null, $data['js'] ?? null, $context);
        return new JsonResponse(['success' => true]);
    }

    private function requireAdministrator(Context $context): void
    {
        $source = $context->getSource();
        if (!$source instanceof AdminApiSource || !$source->isAdmin() || !$source->getUserId()) {
            throw new AccessDeniedHttpException('Only administrator users may access Custom CSS + JS.');
        }
    }
}

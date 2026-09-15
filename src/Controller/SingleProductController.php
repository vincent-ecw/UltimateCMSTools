<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Controller;

use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Storefront\Controller\StorefrontController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use VincentBourgonje\UltimateCmsTools\Core\SingleProductLoader;

#[Route(defaults: ['_routeScope' => ['storefront']])]
final class SingleProductController extends StorefrontController
{
    public function __construct(private readonly SingleProductLoader $loader) {}

    #[Route(path: '/widgets/uct-single-product/{productId}', name: 'frontend.uct.single_product', requirements: ['productId' => '[0-9a-fA-F]{32}'], defaults: ['XmlHttpRequest' => true], methods: ['GET'])]
    public function card(string $productId, Request $request, SalesChannelContext $context): Response
    {
        $options = $request->query->all('options');
        $switched = $request->query->get('switched');
        $slotId = $request->query->get('slotId');
        if (!is_string($slotId) || !Uuid::isValid($slotId) || count($options) > 32) {
            throw new BadRequestHttpException('Invalid variant selection.');
        }
        foreach ($options as $group => $option) {
            if (!is_string($group) || !Uuid::isValid($group) || !is_string($option) || !Uuid::isValid($option)) {
                throw new BadRequestHttpException('Invalid variant selection.');
            }
        }
        if ($switched !== null && (!is_string($switched) || !Uuid::isValid($switched))) {
            throw new BadRequestHttpException('Invalid variant group.');
        }

        $data = $this->loader->load($productId, true, $context, $options, $switched);
        $response = $this->renderStorefront('@UltimateCmsTools/storefront/component/uct-single-product/card.html.twig', [
            'product' => $data->get('product'),
            'configurator' => $data->get('configurator'),
            'showVariants' => true,
            'slotId' => $slotId,
            'layout' => 'standard',
            'displayMode' => 'contain',
        ]);
        $response->headers->set('Cache-Control', 'private, no-store');
        return $response;
    }
}

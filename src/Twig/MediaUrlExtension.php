<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Twig;

use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class MediaUrlExtension extends AbstractExtension
{
    public function __construct(private readonly EntityRepository $mediaRepository)
    {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('uct_media_url', $this->getMediaUrl(...)),
        ];
    }

    public function getMediaUrl(?string $mediaId, ?SalesChannelContext $context = null): ?string
    {
        if (!$mediaId) {
            return null;
        }

        $criteria = new Criteria([$mediaId]);
        $ctx = $context?->getContext() ?? Context::createDefaultContext();
        /** @var MediaEntity|null $media */
        $media = $this->mediaRepository->search($criteria, $ctx)->get($mediaId);

        return $media?->getUrl();
    }
}


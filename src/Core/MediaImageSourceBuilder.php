<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Core;

use Shopware\Core\Content\Media\MediaEntity;

/** Pure presentation policy: never alters media or folder settings. */
final class MediaImageSourceBuilder
{
    // Typical 2x tile frames. The original is retained even if it is smaller.
    private const PROFILES = [
        'card' => [640, 480],
        'card-media' => [640, 544],
        'card-modern' => [640, 640],
        'card-playful' => [336, 336],
        'logo' => [512, 0],
        'logo-playful' => [336, 0],
        'header' => [640, 380],
        'portrait' => [160, 160],
        'content' => [0, 0],
    ];

    /** @return list<array{url: string, width: int, height: int}> */
    public function build(?MediaEntity $media, string $profile = 'content'): array
    {
        if ($media === null) {
            return [];
        }
        $metadata = $media->getMetaData() ?? [];
        $originalWidth = (int) ($metadata['width'] ?? 0);
        $originalHeight = (int) ($metadata['height'] ?? 0);
        [$minimumWidth, $minimumHeight] = self::PROFILES[$profile] ?? self::PROFILES['content'];
        $candidates = [];
        foreach ($media->getThumbnails() ?? [] as $thumbnail) {
            $width = $thumbnail->getWidth();
            $height = $thumbnail->getHeight();
            if ($width < max(1, $minimumWidth) || $height < max(1, $minimumHeight)) {
                continue;
            }
            if ($originalWidth > 0 && $originalHeight > 0) {
                // Reject cropped/stretched/upscaled thumbnails, allowing integer rounding.
                if (abs($height - $width * $originalHeight / $originalWidth) > 1.5
                    || $width > $originalWidth || $height > $originalHeight) {
                    continue;
                }
            }
            $candidates[$width] = ['url' => $thumbnail->getUrl(), 'width' => $width, 'height' => $height];
        }
        // Describe the original with its actual width for correct high-DPR selection.
        if ($originalWidth > 0 && $originalHeight > 0) {
            $candidates[$originalWidth] = [
                'url' => $media->getUrl(), 'width' => $originalWidth, 'height' => $originalHeight,
            ];
        }
        ksort($candidates, SORT_NUMERIC);
        return array_values($candidates);
    }
}

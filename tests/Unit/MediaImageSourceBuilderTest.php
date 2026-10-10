<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Content\Media\Aggregate\MediaThumbnail\MediaThumbnailCollection;
use Shopware\Core\Content\Media\Aggregate\MediaThumbnail\MediaThumbnailEntity;
use Shopware\Core\Content\Media\MediaEntity;
use VincentBourgonje\UltimateCmsTools\Core\MediaImageSourceBuilder;

require_once __DIR__ . '/../../src/Core/MediaImageSourceBuilder.php';

final class MediaImageSourceBuilderTest extends TestCase
{
    public function testRejectsSmallCroppedAndUpscaledCandidatesAndRetainsRealOriginalWidth(): void
    {
        $media = $this->media(1600, 1200, [[320, 240], [640, 480], [800, 800], [2000, 1500]]);
        $sources = (new MediaImageSourceBuilder())->build($media, 'card');
        self::assertSame([640, 1600], array_column($sources, 'width'));
        self::assertSame('/original.png', $sources[1]['url']);
        self::assertSame(1200, $sources[1]['height']);
        self::assertCount(4, $media->getThumbnails()); // No mutation of shared DAL entities.
    }

    public function testKeepsUndersizedOriginalVisibleAndDeduplicatesWidths(): void
    {
        $media = $this->media(300, 200, [[200, 133], [300, 200], [300, 200]]);
        self::assertSame([['url' => '/original.png', 'width' => 300, 'height' => 200]],
            (new MediaImageSourceBuilder())->build($media, 'logo'));
    }

    public function testRespectsWideLogoRatioAndIntegerRounding(): void
    {
        $sources = (new MediaImageSourceBuilder())->build(
            $this->media(1600, 435, [[640, 174], [800, 218], [640, 640]]), 'logo');
        self::assertSame([640, 800, 1600], array_column($sources, 'width'));
    }

    public function testUnknownDimensionsAndMissingThumbnailsRemainUsable(): void
    {
        $builder = new MediaImageSourceBuilder();
        self::assertSame([], $builder->build(null));
        self::assertSame([640], array_column($builder->build($this->media(0, 0, [[640, 480]])), 'width'));
        self::assertSame([1600], array_column($builder->build($this->media(1600, 1200, [])), 'width'));
    }

    private function media(int $width, int $height, array $dimensions): MediaEntity
    {
        $media = new MediaEntity();
        $media->setId(str_repeat('a', 32));
        $media->setUrl('/original.png');
        $media->setMetaData(['width' => $width, 'height' => $height]);
        $thumbnails = new MediaThumbnailCollection();
        foreach ($dimensions as $index => [$thumbWidth, $thumbHeight]) {
            $thumbnail = new MediaThumbnailEntity();
            $thumbnail->setId(str_pad((string) ($index + 1), 32, '0', STR_PAD_LEFT));
            $thumbnail->setWidth($thumbWidth);
            $thumbnail->setHeight($thumbHeight);
            $thumbnail->setUrl('/thumbnail-' . $index . '.png');
            $thumbnails->add($thumbnail);
        }
        $media->setThumbnails($thumbnails);
        return $media;
    }
}

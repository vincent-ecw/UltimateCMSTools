<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Content\Cms\Aggregate\CmsBlock\CmsBlockCollection;
use Shopware\Core\Content\Cms\Aggregate\CmsBlock\CmsBlockEntity;
use Shopware\Core\Content\Cms\Aggregate\CmsSection\CmsSectionCollection;
use Shopware\Core\Content\Cms\Aggregate\CmsSection\CmsSectionEntity;
use Shopware\Core\Content\Cms\CmsPageCollection;
use Shopware\Core\Content\Cms\CmsPageEntity;
use Shopware\Core\Content\Cms\Events\CmsPageLoadedEvent;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\Request;
use VincentBourgonje\UltimateCmsTools\Core\GridColumnStyles;
use VincentBourgonje\UltimateCmsTools\Core\GridLayouts;
use VincentBourgonje\UltimateCmsTools\Subscriber\GridColumnsSubscriber;

require_once __DIR__ . '/../../src/Core/GridLayouts.php';
require_once __DIR__ . '/../../src/Core/GridColumnStyles.php';
require_once __DIR__ . '/../../src/Subscriber/GridColumnsSubscriber.php';

final class GridColumnsSubscriberTest extends TestCase
{
    private function event(array $blocks): CmsPageLoadedEvent
    {
        $section = new CmsSectionEntity();
        $section->setId(str_repeat('a', 32));
        $section->setBlocks(new CmsBlockCollection($blocks));
        $page = new CmsPageEntity();
        $page->setId(str_repeat('b', 32));
        $page->setSections(new CmsSectionCollection([$section]));
        $context = $this->createMock(SalesChannelContext::class);
        $context->method('getContext')->willReturn(Context::createDefaultContext());
        return new CmsPageLoadedEvent(new Request(), new CmsPageCollection([$page]), $context);
    }

    private function block(string $id, array $columns, string $type = 'uct-grid-md-6-6'): CmsBlockEntity
    {
        $block = new CmsBlockEntity();
        $block->setId($id);
        $block->setType($type);
        $block->setCustomFields(['uct_columns' => $columns]);
        return $block;
    }

    public function testOneLookupAcrossBlocksAndPrivateOrMissingMediaHasNoFallback(): void
    {
        $publicId = str_repeat('1', 32);
        $privateId = str_repeat('2', 32);
        $missingId = str_repeat('3', 32);
        $public = new MediaEntity();
        $public->setId($publicId);
        $public->setPrivate(false);
        $public->setUrl('/media/current.jpg');
        $private = new MediaEntity();
        $private->setId($privateId);
        $private->setPrivate(true);
        $private->setUrl('/media/private.jpg');
        $result = $this->createMock(EntitySearchResult::class);
        $result->method('getIterator')->willReturn(new \ArrayIterator([$public, $private]));
        $repository = $this->createMock(EntityRepository::class);
        $repository->expects(self::once())->method('search')
            ->with(self::callback(function ($criteria) use ($publicId, $privateId, $missingId): bool {
                self::assertSame([$publicId, $privateId, $missingId], $criteria->getIds());
                return true;
            }), self::isInstanceOf(Context::class))->willReturn($result);
        $first = $this->block(str_repeat('4', 32), [
            'col1' => ['backgroundMediaId' => $publicId, 'backgroundMediaUrl' => '/stale.jpg'],
            'col2' => ['backgroundMediaId' => $privateId, 'backgroundMediaUrl' => '/private-stale.jpg'],
        ]);
        $second = $this->block(str_repeat('5', 32), [
            'col1' => ['backgroundMediaId' => $publicId],
            'col2' => ['backgroundMediaId' => $missingId, 'backgroundMediaUrl' => '/missing-stale.jpg'],
        ]);
        (new GridColumnsSubscriber($repository, new GridLayouts(), new GridColumnStyles()))->onCmsPageLoaded($this->event([$first, $second]));
        foreach ([$first, $second] as $block) {
            $styles = $block->getExtension('uctGrid')->get('styles');
            self::assertStringContainsString('/media/current.jpg', $styles['col1']);
            self::assertSame('', $styles['col2']);
        }
    }

    public function testNoLookupForInvalidIdsOrUnrelatedBlocks(): void
    {
        $repository = $this->createMock(EntityRepository::class);
        $repository->expects(self::never())->method('search');
        $grid = $this->block(str_repeat('6', 32), [
            'col1' => ['backgroundMediaId' => 'invalid', 'backgroundMediaUrl' => '/stale.jpg'],
            'col2' => ['padding' => '12px'],
        ]);
        $other = $this->block(str_repeat('7', 32), ['col1' => ['backgroundMediaId' => str_repeat('1', 32)]], 'text');
        (new GridColumnsSubscriber($repository, new GridLayouts(), new GridColumnStyles()))->onCmsPageLoaded($this->event([$grid, $other]));
        self::assertSame('', $grid->getExtension('uctGrid')->get('styles')['col1']);
        self::assertStringContainsString('12px', $grid->getExtension('uctGrid')->get('styles')['col2']);
        self::assertNull($other->getExtension('uctGrid'));
    }
}

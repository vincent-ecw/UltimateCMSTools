<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Content\Cms\Aggregate\CmsBlock\CmsBlockEntity;
use Shopware\Core\Content\Cms\Aggregate\CmsSection\CmsSectionEntity;
use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotCollection;
use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\CmsPageEntity;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult;
use Symfony\Component\Console\Tester\CommandTester;
use VincentBourgonje\UltimateCmsTools\Core\GridLayouts;
use VincentBourgonje\UltimateCmsTools\Core\GridMigration;
use VincentBourgonje\UltimateCmsTools\Command\GridMigrationCommand;

require_once __DIR__ . '/../../src/Core/GridLayouts.php';
require_once __DIR__ . '/../../src/Core/GridMigration.php';
require_once __DIR__ . '/../../src/Command/GridMigrationCommand.php';

final class GridMigrationTest extends TestCase
{
    private function block(bool $uctData = true): CmsBlockEntity
    {
        $page = new CmsPageEntity();
        $page->setId(str_repeat('1', 32));
        $page->setLocked(false);
        $section = new CmsSectionEntity();
        $section->setId(str_repeat('2', 32));
        $section->setPageId($page->getId());
        $section->setPage($page);
        $block = new CmsBlockEntity();
        $block->setId(str_repeat('3', 32));
        $block->setVersionId(Defaults::LIVE_VERSION);
        $block->setType('grid-md-6-6');
        $block->setLocked(false);
        $block->setSection($section);
        $block->setCustomFields($uctData ? ['uct_columns' => ['col1' => ['padding' => '24px']]] : ['uct_columns' => [], 'uct_selected_column' => 1]);
        $block->setSlots(new CmsSlotCollection());
        return $block;
    }

    private function searchResult(array $blocks): EntitySearchResult
    {
        $result = $this->createMock(EntitySearchResult::class);
        $result->method('getIterator')->willReturnCallback(static fn () => new \ArrayIterator($blocks));
        $result->method('count')->willReturn(\count($blocks));
        return $result;
    }

    public function testPreviewDoesNotWriteAndIdentifiesOnlyActualUctEvidence(): void
    {
        $block = $this->block();
        $repository = $this->createMock(EntityRepository::class);
        $repository->expects(self::once())->method('search')->willReturn($this->searchResult([$block]));
        $repository->expects(self::never())->method('update');
        $migration = new GridMigration($repository, new GridLayouts());
        $tester = new CommandTester(new GridMigrationCommand($migration));
        self::assertSame(0, $tester->execute(['--all' => true, '--uct-only' => true]));
        self::assertStringContainsString('uct-grid-md-6-6', $tester->getDisplay());
        self::assertStringContainsString('No data changed', $tester->getDisplay());
        self::assertSame('grid-md-6-6', $block->getType());
        self::assertFalse($migration->hasUctData($this->block(false)));
        $slot = new CmsSlotEntity();
        $slot->setId(str_repeat('4', 32));
        $slot->setSlot('content1_' . str_repeat('5', 32));
        $withoutStyles = $this->block(false);
        $withoutStyles->setSlots(new CmsSlotCollection([$slot]));
        self::assertTrue($migration->hasUctData($withoutStyles));
    }

    public function testScopeAndBackupAreRequiredBeforeWriting(): void
    {
        $repository = $this->createMock(EntityRepository::class);
        $repository->method('search')->willReturn($this->searchResult([$this->block()]));
        $repository->expects(self::never())->method('update');
        $tester = new CommandTester(new GridMigrationCommand(new GridMigration($repository, new GridLayouts())));
        self::assertSame(1, $tester->execute([]));
        self::assertSame(1, $tester->execute(['--all' => true, '--page' => [str_repeat('1', 32)]]));
        self::assertSame(1, $tester->execute(['--page' => ['invalid']]));
        self::assertSame(1, $tester->execute(['--all' => true, '--apply' => true]));
        self::assertStringContainsString('requires --backup', $tester->getDisplay());
    }

    public function testLockedAndUnmarkedBlocksAreSkipped(): void
    {
        $block = $this->block(false);
        $repository = $this->createMock(EntityRepository::class);
        $repository->method('search')->willReturn($this->searchResult([$block]));
        $repository->expects(self::never())->method('update');
        $migration = new GridMigration($repository, new GridLayouts());
        self::assertSame([], $migration->plan([], true, true, Context::createDefaultContext())['changes']);
        $block->getSection()->getPage()->setLocked(true);
        $plan = $migration->plan([], true, false, Context::createDefaultContext());
        self::assertSame([], $plan['changes']);
        self::assertCount(1, $plan['skipped']);
    }

    public function testBackupRestoresOnlyKnownTypePairsAndLiveVersions(): void
    {
        $migration = new GridMigration($this->createMock(EntityRepository::class), new GridLayouts());
        $entry = ['blockId' => str_repeat('3', 32), 'pageId' => str_repeat('1', 32), 'versionId' => Defaults::LIVE_VERSION, 'from' => 'grid-md-6-6', 'to' => 'uct-grid-md-6-6'];
        $restore = $migration->restorePlan(['schemaVersion' => 1, 'changes' => [$entry]]);
        self::assertSame('uct-grid-md-6-6', $restore['changes'][0]['from']);
        self::assertSame('grid-md-6-6', $restore['changes'][0]['to']);
        $this->expectException(\InvalidArgumentException::class);
        $migration->restorePlan(['schemaVersion' => 1, 'changes' => [[...$entry, 'to' => 'text']]]);
    }

    public function testApplyCreatesBackupFirstAndUpdatesOnlyType(): void
    {
        $block = $this->block();
        $originalFields = $block->getCustomFields();
        $repository = $this->createMock(EntityRepository::class);
        $repository->expects(self::exactly(2))->method('search')->willReturn($this->searchResult([$block]));
        $path = sys_get_temp_dir() . '/uct-grid-backup-' . bin2hex(random_bytes(8)) . '.json';
        $repository->expects(self::once())->method('update')->with(self::callback(function (array $updates) use ($path): bool {
            self::assertFileExists($path);
            $backup = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
            self::assertSame('grid-md-6-6', $backup['changes'][0]['from']);
            self::assertSame([['id' => str_repeat('3', 32), 'versionId' => Defaults::LIVE_VERSION, 'type' => 'uct-grid-md-6-6']], $updates);
            return true;
        }), self::isInstanceOf(Context::class));
        $tester = new CommandTester(new GridMigrationCommand(new GridMigration($repository, new GridLayouts())));
        try {
            self::assertSame(0, $tester->execute(['--all' => true, '--apply' => true, '--backup' => $path]));
            self::assertSame($originalFields, $block->getCustomFields());
            self::assertCount(0, $block->getSlots());
        } finally {
            if (is_file($path)) {
                unlink($path);
            }
        }
    }

    public function testExistingBackupCannotBeOverwrittenAndStreamsAreRejected(): void
    {
        $repository = $this->createMock(EntityRepository::class);
        $repository->method('search')->willReturn($this->searchResult([$this->block()]));
        $repository->expects(self::never())->method('update');
        $tester = new CommandTester(new GridMigrationCommand(new GridMigration($repository, new GridLayouts())));
        $path = tempnam(sys_get_temp_dir(), 'uct-grid-existing-');
        file_put_contents($path, 'original backup');
        try {
            self::assertSame(1, $tester->execute(['--all' => true, '--apply' => true, '--backup' => $path]));
            self::assertSame('original backup', file_get_contents($path));
            self::assertSame(1, $tester->execute(['--all' => true, '--apply' => true, '--backup' => 'php://temp']));
            self::assertSame(1, $tester->execute(['--restore' => 'data://text/plain,{}']));
        } finally {
            unlink($path);
        }
    }

    public function testChangedBlockAbortsRestoreBeforeWriting(): void
    {
        $repository = $this->createMock(EntityRepository::class);
        $repository->method('search')->willReturn($this->searchResult([$this->block()]));
        $repository->expects(self::never())->method('update');
        $migration = new GridMigration($repository, new GridLayouts());
        $this->expectException(\RuntimeException::class);
        $migration->apply([[
            'blockId' => str_repeat('3', 32), 'pageId' => str_repeat('1', 32), 'versionId' => Defaults::LIVE_VERSION,
            'from' => 'uct-grid-md-6-6', 'to' => 'grid-md-6-6',
        ]], Context::createDefaultContext());
    }
}

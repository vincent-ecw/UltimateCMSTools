<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use League\Flysystem\FilesystemOperator;
use PHPUnit\Framework\TestCase;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\System\SalesChannel\SalesChannelCollection;
use Shopware\Core\System\SalesChannel\SalesChannelEntity;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Storefront\Theme\ThemeCollection;
use Shopware\Storefront\Theme\ThemeEntity;
use Shopware\Storefront\Theme\ThemeService;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use VincentBourgonje\UltimateCmsTools\Core\CustomAssetsService;

require_once __DIR__ . '/../../src/Core/CustomAssetsService.php';

final class CustomAssetsServiceTest extends TestCase
{
    public function testPublishesIndependentAssetsAndClearsEmptyJavaScript(): void
    {
        $context = Context::createDefaultContext();
        $channel = new SalesChannelEntity();
        $channel->setId(Uuid::randomHex());
        $channel->setTypeId(Defaults::SALES_CHANNEL_TYPE_STOREFRONT);
        $theme = new ThemeEntity();
        $theme->setId(Uuid::randomHex());
        $channel->addExtension('themes', new ThemeCollection([$theme]));
        $repository = $this->createMock(EntityRepository::class);
        $repository->method('search')->willReturn(new EntitySearchResult('sales_channel', 1,
            new SalesChannelCollection([$channel]), null, new Criteria(), $context));
        $filesystem = $this->createMock(FilesystemOperator::class);
        $css = '.test { color: red; }';
        $path = 'uct-custom-assets/' . $channel->getId() . '/' . hash('sha256', $css) . '.css';
        $filesystem->expects(self::once())->method('write')->with($path, $css);
        $themes = $this->createMock(ThemeService::class);
        $themes->expects(self::once())->method('compileTheme')->with($channel->getId(), $theme->getId(),
            self::callback(fn (Context $compileContext) => $compileContext->hasState(ThemeService::STATE_NO_QUEUE)));
        $config = $this->createMock(SystemConfigService::class);
        $config->expects(self::once())->method('set')->with(CustomAssetsService::KEY,
            ['css' => $css, 'js' => '', 'cssPath' => $path, 'jsPath' => null], $channel->getId());
        (new CustomAssetsService($config, $repository, $filesystem, $themes))->publish([$channel->getId()], $css, '', $context);
    }

    public function testInvalidIdsNeverWriteAssets(): void
    {
        $filesystem = $this->createMock(FilesystemOperator::class);
        $filesystem->expects(self::never())->method('write');
        $service = new CustomAssetsService($this->createMock(SystemConfigService::class),
            $this->createMock(EntityRepository::class), $filesystem, $this->createMock(ThemeService::class));
        $this->expectException(BadRequestHttpException::class);
        $service->publish(['../../escape'], '', '', Context::createDefaultContext());
    }
}

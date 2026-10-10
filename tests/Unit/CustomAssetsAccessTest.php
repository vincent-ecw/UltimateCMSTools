<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit;

use League\Flysystem\FilesystemOperator;
use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\Api\Context\AdminApiSource;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\IdSearchResult;
use Shopware\Core\Framework\DataAbstractionLayer\Write\Command\WriteCommand;
use Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\PreWriteValidationEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Write\WriteContext;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SystemConfig\Event\BeforeSystemConfigChangedEvent;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Storefront\Theme\ThemeService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use VincentBourgonje\UltimateCmsTools\Controller\CustomAssetsController;
use VincentBourgonje\UltimateCmsTools\Core\CustomAssetsService;
use VincentBourgonje\UltimateCmsTools\Subscriber\CustomAssetsAccessSubscriber;

require_once __DIR__ . '/../../src/Core/CustomAssetsService.php';
require_once __DIR__ . '/../../src/Controller/CustomAssetsController.php';
require_once __DIR__ . '/../../src/Subscriber/CustomAssetsAccessSubscriber.php';

final class CustomAssetsAccessTest extends TestCase
{
    private function context(bool $admin = false, bool $integration = false): Context
    {
        $source = new AdminApiSource($integration ? null : Uuid::randomHex(), $integration ? Uuid::randomHex() : null);
        $source->setIsAdmin($admin);
        $source->setPermissions(['admin', 'system_config:update', 'theme:update']);
        return new Context($source);
    }

    private function controller(): CustomAssetsController
    {
        $repository = $this->createMock(EntityRepository::class);
        $repository->expects(self::never())->method('search');
        return new CustomAssetsController(new CustomAssetsService($this->createMock(SystemConfigService::class),
            $repository, $this->createMock(FilesystemOperator::class), $this->createMock(ThemeService::class)));
    }

    public function testDelegatedPermissionsCannotReadCode(): void
    {
        $this->expectException(AccessDeniedHttpException::class);
        $this->controller()->load(Uuid::randomHex(), $this->context());
    }

    public function testDelegatedPermissionsCannotPublishCode(): void
    {
        $this->expectException(AccessDeniedHttpException::class);
        $this->controller()->publish(new Request(), $this->context());
    }

    public function testAdminIntegrationCannotPublishCode(): void
    {
        $this->expectException(AccessDeniedHttpException::class);
        $this->controller()->publish(new Request(), $this->context(true, true));
    }

    public function testAdministratorPassesAccessCheckAndReachesInputValidation(): void
    {
        $this->expectException(BadRequestHttpException::class);
        $this->controller()->publish(new Request(content: '{"salesChannelIds":null}'), $this->context(true));
    }

    public function testGenericConfigurationWriteCannotBypassAdministratorCheck(): void
    {
        $requests = new RequestStack();
        $request = new Request();
        $request->attributes->set(PlatformRequest::ATTRIBUTE_CONTEXT_OBJECT, $this->context());
        $requests->push($request);
        $subscriber = new CustomAssetsAccessSubscriber($requests, $this->createMock(EntityRepository::class));
        $this->expectException(AccessDeniedHttpException::class);
        $subscriber->protectConfiguration(new BeforeSystemConfigChangedEvent(' ' . CustomAssetsService::KEY . ' ', [], null));
    }

    public function testAdministratorMayWriteConfiguration(): void
    {
        $requests = new RequestStack();
        $request = new Request();
        $request->attributes->set(PlatformRequest::ATTRIBUTE_CONTEXT_OBJECT, $this->context(true));
        $requests->push($request);
        (new CustomAssetsAccessSubscriber($requests, $this->createMock(EntityRepository::class)))
            ->protectConfiguration(new BeforeSystemConfigChangedEvent(CustomAssetsService::KEY, [], null));
        self::assertTrue(true);
    }

    public function testDalUpdateWithoutKeyCannotBypassAdministratorCheck(): void
    {
        $context = $this->context();
        $id = Uuid::randomHex();
        $command = $this->getMockBuilder(WriteCommand::class)->disableOriginalConstructor()->getMock();
        $command->method('getEntityName')->willReturn('system_config');
        $command->method('getPayload')->willReturn(['configuration_value' => '{}']);
        $command->method('getPrimaryKey')->willReturn(['id' => Uuid::fromHexToBytes($id)]);
        $repository = $this->createMock(EntityRepository::class);
        $repository->method('searchIds')->willReturn(new IdSearchResult(1, [], new Criteria(), $context));
        $subscriber = new CustomAssetsAccessSubscriber(new RequestStack(), $repository);
        $this->expectException(AccessDeniedHttpException::class);
        $subscriber->protectDalWrites(new PreWriteValidationEvent(WriteContext::createFromContext($context), [$command]));
    }
}

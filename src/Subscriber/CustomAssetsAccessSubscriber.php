<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Subscriber;

use Shopware\Core\Framework\Api\Context\AdminApiSource;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\PreWriteValidationEvent;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SystemConfig\Event\BeforeSystemConfigChangedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use VincentBourgonje\UltimateCmsTools\Core\CustomAssetsService;

final class CustomAssetsAccessSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly RequestStack $requests,
        private readonly EntityRepository $configRepository,
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [BeforeSystemConfigChangedEvent::class => 'protectConfiguration', PreWriteValidationEvent::class => 'protectDalWrites'];
    }

    public function protectConfiguration(BeforeSystemConfigChangedEvent $event): void
    {
        if (trim($event->getKey()) !== CustomAssetsService::KEY) {
            return;
        }
        $request = $this->requests->getMainRequest();
        // Allow trusted CLI/background maintenance, but fail closed for HTTP writes.
        if (!$request) {
            return;
        }
        $context = $request->attributes->get(PlatformRequest::ATTRIBUTE_CONTEXT_OBJECT);
        if (!$context instanceof Context || !$this->isAdministrator($context)) {
            throw new AccessDeniedHttpException('Only administrator users may modify Custom CSS + JS.');
        }
    }

    public function protectDalWrites(PreWriteValidationEvent $event): void
    {
        $context = $event->getContext();
        if (!$context->getSource() instanceof AdminApiSource || $this->isAdministrator($context)) {
            return;
        }
        $ids = [];
        foreach ($event->getCommandsForEntity('system_config') as $command) {
            if (trim($command->getPayload()['configuration_key'] ?? '') === CustomAssetsService::KEY) {
                throw new AccessDeniedHttpException('Only administrator users may modify Custom CSS + JS.');
            }
            $id = $command->getPrimaryKey()['id'] ?? null;
            if (is_string($id)) {
                $ids[] = Uuid::fromBytesToHex($id);
            }
        }
        if (!$ids) {
            return;
        }
        // Updates and deletes can omit the key. Resolve existing records through DAL.
        $criteria = (new Criteria($ids))->addFilter(new EqualsFilter('configurationKey', CustomAssetsService::KEY));
        if ($this->configRepository->searchIds($criteria, $context)->getTotal() > 0) {
            throw new AccessDeniedHttpException('Only administrator users may modify Custom CSS + JS.');
        }
    }

    private function isAdministrator(Context $context): bool
    {
        $source = $context->getSource();
        return $source instanceof AdminApiSource && $source->isAdmin() && $source->getUserId() !== null;
    }
}

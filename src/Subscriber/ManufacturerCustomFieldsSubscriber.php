<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Subscriber;

use Shopware\Core\Framework\Plugin\Event\PluginPostActivateEvent;
use Shopware\Core\Framework\Plugin\Event\PluginPostUpdateEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use VincentBourgonje\UltimateCmsTools\Core\ManufacturerCustomFields;

final class ManufacturerCustomFieldsSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly ManufacturerCustomFields $customFields)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            PluginPostActivateEvent::class => 'onPluginReady',
            PluginPostUpdateEvent::class => 'onPluginReady',
        ];
    }

    public function onPluginReady(PluginPostActivateEvent|PluginPostUpdateEvent $event): void
    {
        if ($event->getPlugin()->getName() !== 'UltimateCmsTools') {
            return;
        }

        $this->customFields->ensureSortingOrder($event->getContext()->getContext());
    }
}

<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Subscriber;

use Shopware\Core\Framework\Adapter\Cache\Event\HttpCacheCookieEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class HttpCacheSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            HttpCacheCookieEvent::class => 'onHttpCacheCookie',
        ];
    }

    public function onHttpCacheCookie(HttpCacheCookieEvent $event): void
    {
        $customerGroupId = $event->context->getCustomer()?->getGroupId() ?? $event->context->getCurrentCustomerGroup()->getId();
        $event->add('customer-group-id', $customerGroupId);
    }
}

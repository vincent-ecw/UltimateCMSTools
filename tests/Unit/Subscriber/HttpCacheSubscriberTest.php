<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Tests\Unit\Subscriber;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Checkout\Customer\Aggregate\CustomerGroup\CustomerGroupEntity;
use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Framework\Adapter\Cache\Event\HttpCacheCookieEvent;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\Request;
use VincentBourgonje\UltimateCmsTools\Subscriber\HttpCacheSubscriber;

require_once __DIR__ . '/../../../src/Subscriber/HttpCacheSubscriber.php';

final class HttpCacheSubscriberTest extends TestCase
{
    public function testCustomerGroupChangesCacheCookieHash(): void
    {
        $guestA = $this->eventForGroup('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        $guestB = $this->eventForGroup('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        $customerB = $this->eventForGroup('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

        $subscriber = new HttpCacheSubscriber();
        $subscriber->onHttpCacheCookie($guestA);
        $subscriber->onHttpCacheCookie($guestB);
        $subscriber->onHttpCacheCookie($customerB);

        static::assertSame('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', $guestA->get('customer-group-id'));
        static::assertSame('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', $customerB->get('customer-group-id'));
        static::assertNotSame($guestA->getHash(), $guestB->getHash());
        static::assertSame($guestB->getHash(), $customerB->getHash());
    }

    private function eventForGroup(string $currentGroupId, ?string $customerGroupId = null): HttpCacheCookieEvent
    {
        $group = new CustomerGroupEntity();
        $group->setId($currentGroupId);

        $context = $this->createMock(SalesChannelContext::class);
        $context->method('getCurrentCustomerGroup')->willReturn($group);

        if ($customerGroupId !== null) {
            $customer = new CustomerEntity();
            $customer->setGroupId($customerGroupId);
            $context->method('getCustomer')->willReturn($customer);
        }

        return new HttpCacheCookieEvent(new Request(), $context, []);
    }
}

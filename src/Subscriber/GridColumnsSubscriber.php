<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Subscriber;

use Shopware\Core\Content\Cms\Events\CmsPageLoadedEvent;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Struct\ArrayStruct;
use Shopware\Core\Framework\Uuid\Uuid;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use VincentBourgonje\UltimateCmsTools\Core\GridLayouts;
use VincentBourgonje\UltimateCmsTools\Core\GridColumnStyles;

final class GridColumnsSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly EntityRepository $mediaRepository,
        private readonly GridLayouts $layouts,
        private readonly GridColumnStyles $styles,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [CmsPageLoadedEvent::class => 'onCmsPageLoaded'];
    }

    public function onCmsPageLoaded(CmsPageLoadedEvent $event): void
    {
        $blocks = [];
        $ids = [];
        foreach ($event->getResult() as $page) {
            foreach ($page->getSections()?->getBlocks() ?? [] as $block) {
                if (!$this->layouts->has($block->getType())) {
                    continue;
                }
                $blocks[] = $block;
                $configs = $block->getCustomFields()['uct_columns'] ?? [];
                $configs = \is_array($configs) ? $configs : [];
                foreach ($this->layouts->getColumns($block->getType()) as $column) {
                    $id = $configs['col' . $column['index']]['backgroundMediaId'] ?? null;
                    if (\is_string($id) && Uuid::isValid($id)) {
                        $ids[$id] = $id;
                    }
                }
            }
        }

        // One DAL search for all distinct valid background IDs across all pages.
        $urls = [];
        if ($ids !== []) {
            $media = $this->mediaRepository->search(new Criteria(array_values($ids)), $event->getContext());
            foreach ($media as $item) {
                if ($item instanceof MediaEntity && !$item->isPrivate()) {
                    $urls[$item->getId()] = $item->getUrl();
                }
            }
        }

        foreach ($blocks as $block) {
            $configs = $block->getCustomFields()['uct_columns'] ?? [];
            $configs = \is_array($configs) ? $configs : [];
            $columns = [];
            foreach ($this->layouts->getColumns($block->getType()) as $column) {
                $key = 'col' . $column['index'];
                $config = $configs[$key] ?? [];
                $id = \is_array($config) ? ($config['backgroundMediaId'] ?? null) : null;
                $columns[$key] = $this->styles->getStyles($config, \is_string($id) ? ($urls[$id] ?? null) : null);
            }
            $block->addExtension('uctGrid', new ArrayStruct(['styles' => $columns]));
        }
    }
}

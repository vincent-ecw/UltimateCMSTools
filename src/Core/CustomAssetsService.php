<?php declare(strict_types=1);

namespace VincentBourgonje\UltimateCmsTools\Core;

use League\Flysystem\FilesystemOperator;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Storefront\Theme\ThemeService;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class CustomAssetsService
{
    public const KEY = 'UltimateCmsTools.customAssets';

    public function __construct(
        private readonly SystemConfigService $config,
        private readonly EntityRepository $salesChannels,
        private readonly FilesystemOperator $filesystem,
        private readonly ThemeService $themes,
    ) {}

    public function load(string $id, Context $context): array
    {
        $this->channels([$id], $context);
        return $this->config->get(self::KEY, $id) ?? ['css' => '', 'js' => ''];
    }

    public function publish(array $ids, mixed $css, mixed $js, Context $context): void
    {
        if (!is_string($css) || !is_string($js) || strlen($css) > 1048576 || strlen($js) > 1048576) {
            throw new BadRequestHttpException('CSS and JavaScript must be strings of at most 1 MB each.');
        }
        $channels = $this->channels($ids, $context);
        $compileContext = clone $context;
        $compileContext->addState(ThemeService::STATE_NO_QUEUE);
        // Prepare every asset and compile before activating the new configuration.
        $published = [];
        foreach ($channels as $channel) {
            $paths = [];
            foreach (['css' => $css, 'js' => $js] as $extension => $code) {
                $paths[$extension . 'Path'] = null;
                if (trim($code) === '') {
                    continue;
                }
                $path = 'uct-custom-assets/' . $channel->getId() . '/' . hash('sha256', $code) . '.' . $extension;
                $this->filesystem->write($path, $code);
                $paths[$extension . 'Path'] = $path;
            }
            $themeId = $channel->getExtension('themes')?->first()?->getId();
            if (!$themeId) {
                throw new BadRequestHttpException('Every selected sales channel must have an assigned theme.');
            }
            $this->themes->compileTheme($channel->getId(), $themeId, $compileContext);
            $published[$channel->getId()] = ['css' => $css, 'js' => $js] + $paths;
        }
        foreach ($published as $id => $value) {
            $this->config->set(self::KEY, $value, $id);
        }
    }

    private function channels(array $ids, Context $context): iterable
    {
        if (!$ids || count($ids) > 100) {
            throw new BadRequestHttpException('Select between 1 and 100 storefront sales channels.');
        }
        foreach ($ids as $id) {
            if (!is_string($id) || !Uuid::isValid($id)) {
                throw new BadRequestHttpException('Invalid sales channel ID.');
            }
        }
        $ids = array_values(array_unique($ids));
        $criteria = (new Criteria($ids))->addAssociation('themes');
        $channels = $this->salesChannels->search($criteria, $context)->getEntities();
        if ($channels->count() !== count($ids)) {
            throw new BadRequestHttpException('Unknown sales channel.');
        }
        foreach ($channels as $channel) {
            if ($channel->getTypeId() !== Defaults::SALES_CHANNEL_TYPE_STOREFRONT) {
                throw new BadRequestHttpException('Only storefront sales channels are supported.');
            }
        }
        return $channels;
    }
}

import SubcategoryCarouselPlugin from './plugin/subcategory-carousel.plugin';
import ManufacturerCarouselPlugin from './plugin/manufacturer-carousel.plugin';
import CommonSliderPlugin from './plugin/common-slider.plugin';
import CustomCarouselPlugin from './plugin/custom-carousel.plugin';
import CustomProductCarouselPlugin from './plugin/custom-product-carousel.plugin';
import StatisticsCounterPlugin from './plugin/statistics-counter.plugin';
import IconListAnimationPlugin from './plugin/icon-list-animation.plugin';
import FlexibleImageTextAnimationPlugin from './plugin/flexible-image-text-animation.plugin';

window.PluginManager.register('SubcategoryCarousel', SubcategoryCarouselPlugin, '[data-subcategory-carousel]');
window.PluginManager.register('ManufacturerCarousel', ManufacturerCarouselPlugin, '[data-manufacturer-carousel]');
window.PluginManager.register('CommonSlider', CommonSliderPlugin, '[data-common-slider]');
window.PluginManager.register('CustomCarousel', CustomCarouselPlugin, '[data-custom-carousel]');
window.PluginManager.register('CustomProductCarousel', CustomProductCarouselPlugin, '[data-custom-product-carousel]');
window.PluginManager.register('StatisticsCounter', StatisticsCounterPlugin, '[data-statistics-counter]');
window.PluginManager.register('IconListAnimation', IconListAnimationPlugin, '[data-icon-list-animation]');
window.PluginManager.register('FlexibleImageTextAnimation', FlexibleImageTextAnimationPlugin, '[data-flexible-image-text-animation]');




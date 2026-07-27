import SubcategoryCarouselPlugin from './plugin/subcategory-carousel.plugin';
import ManufacturerCarouselPlugin from './plugin/manufacturer-carousel.plugin';
import CommonSliderPlugin from './plugin/common-slider.plugin';
import CustomCarouselPlugin from './plugin/custom-carousel.plugin';
import CustomProductCarouselPlugin from './plugin/custom-product-carousel.plugin';
import StatisticsCounterPlugin from './plugin/statistics-counter.plugin';

window.PluginManager.register('SubcategoryCarousel', SubcategoryCarouselPlugin, '[data-subcategory-carousel]');
window.PluginManager.register('ManufacturerCarousel', ManufacturerCarouselPlugin, '[data-manufacturer-carousel]');
window.PluginManager.register('CommonSlider', CommonSliderPlugin, '[data-common-slider]');
window.PluginManager.register('CustomCarousel', CustomCarouselPlugin, '[data-custom-carousel]');
window.PluginManager.register('CustomProductCarousel', CustomProductCarouselPlugin, '[data-custom-product-carousel]');
window.PluginManager.register('StatisticsCounter', StatisticsCounterPlugin, '[data-statistics-counter]');


import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'custom-carousel',
    label: 'sw-cms.elements.customCarousel.label',
    component: 'sw-cms-el-custom-carousel',
    configComponent: 'sw-cms-el-config-custom-carousel',
    previewComponent: 'sw-cms-el-preview-custom-carousel',
    defaultConfig: {
        carouselItems: {
            source: 'static',
            value: []
        },
        navigationArrows: {
            source: 'static',
            value: true
        },
        navigationDots: {
            source: 'static',
            value: true
        },
        navigationDotsPosition: {
            source: 'static',
            value: 'inside'
        },
        autoplay: {
            source: 'static',
            value: true
        },
        autoplaySpeed: {
            source: 'static',
            value: 5000
        },
        maxHeight: {
            source: 'static',
            value: null
        },
        theme: {
            source: 'static',
            value: 'classic'
        },
        itemsToDisplay: {
            source: 'static',
            value: null
        },
        highlightActiveItem: {
            source: 'static',
            value: false
        }
    }
});

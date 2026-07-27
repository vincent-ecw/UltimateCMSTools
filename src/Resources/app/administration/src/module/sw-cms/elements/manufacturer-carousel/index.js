import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'manufacturer-carousel',
    label: 'sw-cms.elements.ultimateCmsTools.manufacturerCarousel.label',
    component: 'sw-cms-el-manufacturer-carousel',
    configComponent: 'sw-cms-el-config-manufacturer-carousel',
    previewComponent: 'sw-cms-el-preview-manufacturer-carousel',
    defaultConfig: {
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
        displayLogo: {
            source: 'static',
            value: true
        },
        displayTitle: {
            source: 'static',
            value: true
        },
        displayDescription: {
            source: 'static',
            value: true
        }
    }
});

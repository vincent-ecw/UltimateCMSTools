import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'custom-product-carousel',
    label: 'sw-cms.elements.customProductCarousel.label',
    component: 'sw-cms-el-custom-product-carousel',
    configComponent: 'sw-cms-el-config-custom-product-carousel',
    previewComponent: 'sw-cms-el-preview-custom-product-carousel',
    defaultConfig: {
        productSelectionType: {
            source: 'static',
            value: 'manual'
        },
        products: {
            source: 'static',
            value: []
        },
        productStreamId: {
            source: 'static',
            value: null
        },
        limit: {
            source: 'static',
            value: 10
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
        }
    }
});

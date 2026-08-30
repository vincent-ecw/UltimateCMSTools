import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'related-products',
    label: 'sw-cms.elements.relatedProducts.label',
    component: 'sw-cms-el-related-products',
    configComponent: 'sw-cms-el-config-related-products',
    previewComponent: 'sw-cms-el-preview-related-products',
    defaultConfig: {
        carouselIndex: {
            source: 'static',
            value: 'all'
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

import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'subcategory-carousel',
    label: 'sw-cms.elements.subcategoryCarousel.label',
    component: 'sw-cms-el-subcategory-carousel',
    configComponent: 'sw-cms-el-config-subcategory-carousel',
    previewComponent: 'sw-cms-el-preview-subcategory-carousel',
    defaultConfig: {
        showAllSubcategories: {
            source: 'static',
            value: false
        },
        displayImage: {
            source: 'static',
            value: true
        },
        displayDescription: {
            source: 'static',
            value: true
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

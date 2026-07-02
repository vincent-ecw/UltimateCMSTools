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
        }
    }
});

import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'common-slider',
    label: 'sw-cms.elements.ultimateCmsTools.commonSlider.label',
    component: 'sw-cms-el-common-slider',
    configComponent: 'sw-cms-el-config-common-slider',
    previewComponent: 'sw-cms-el-preview-common-slider',
    defaultConfig: {
        sliderItems: {
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
        effect: {
            source: 'static',
            value: 'slide'
        },
        navigationDotsPosition: {
            source: 'static',
            value: 'inside'
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

import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'image-text-quartet',
    label: 'sw-cms.elements.ultimateCmsTools.imageTextQuartet.label',
    component: 'sw-cms-el-image-text-quartet',
    configComponent: 'sw-cms-el-config-image-text-quartet',
    previewComponent: 'sw-cms-el-preview-image-text-quartet',
    defaultConfig: {
        media1Desktop: {
            source: 'static',
            value: null,
            required: true,
            entity: 'media'
        },
        media1Tablet: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        media1Mobile: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        altText1: {
            source: 'static',
            value: ''
        },
        text1: {
            source: 'static',
            value: ''
        },
        ratio1: {
            source: 'static',
            value: '50-50'
        },
        media2Desktop: {
            source: 'static',
            value: null,
            required: true,
            entity: 'media'
        },
        media2Tablet: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        media2Mobile: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        altText2: {
            source: 'static',
            value: ''
        },
        text2: {
            source: 'static',
            value: ''
        },
        ratio2: {
            source: 'static',
            value: '50-50'
        }
    }
});

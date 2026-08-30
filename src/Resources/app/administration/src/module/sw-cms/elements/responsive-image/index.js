import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'responsive-image',
    label: 'sw-cms.elements.ultimateCmsTools.responsiveImage.label',
    component: 'sw-cms-el-responsive-image',
    configComponent: 'sw-cms-el-config-responsive-image',
    previewComponent: 'sw-cms-el-preview-responsive-image',
    defaultData: {
        mediaDesktop: null,
        mediaTablet: null,
        mediaMobile: null
    },
    defaultConfig: {
        mediaDesktop: {
            source: 'static',
            value: null,
            required: true,
            entity: 'media'
        },
        mediaTablet: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        mediaMobile: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        altText: {
            source: 'static',
            value: ''
        },
        linkUrl: {
            source: 'static',
            value: ''
        },
        linkTarget: {
            source: 'static',
            value: '_self'
        }
    }
});

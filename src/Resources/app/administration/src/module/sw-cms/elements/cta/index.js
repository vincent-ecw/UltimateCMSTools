import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'cta',
    label: 'sw-cms.elements.ultimateCmsTools.cta.label',
    component: 'sw-cms-el-cta',
    configComponent: 'sw-cms-el-config-cta',
    previewComponent: 'sw-cms-el-preview-cta',
    defaultConfig: {
        title: {
            source: 'static',
            value: ''
        },
        subtitle: {
            source: 'static',
            value: ''
        },
        buttonText: {
            source: 'static',
            value: ''
        },
        buttonUrl: {
            source: 'static',
            value: ''
        },
        buttonTarget: {
            source: 'static',
            value: '_self'
        },
        buttonSecondaryText: {
            source: 'static',
            value: ''
        },
        buttonSecondaryUrl: {
            source: 'static',
            value: ''
        },
        buttonSecondaryTarget: {
            source: 'static',
            value: '_self'
        },
        backgroundImage: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        style: {
            source: 'static',
            value: 'split-minimal'
        },
        textColor: {
            source: 'static',
            value: 'dark'
        }
    }
});

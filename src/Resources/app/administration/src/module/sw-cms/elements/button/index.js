import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'button',
    label: 'sw-cms.elements.ultimateCmsTools.button.label',
    component: 'sw-cms-el-button',
    configComponent: 'sw-cms-el-config-button',
    previewComponent: 'sw-cms-el-preview-button',
    defaultConfig: {
        title: {
            source: 'static',
            value: 'Click here',
        },
        variant: {
            source: 'static',
            value: 'primary',
        },
        width: {
            source: 'static',
            value: 'auto',
        },
        alignment: {
            source: 'static',
            value: 'left',
        },
        verticalAlignment: {
            source: 'static',
            value: 'top',
        },
        linkUrl: {
            source: 'static',
            value: '',
        },
        linkTarget: {
            source: 'static',
            value: '_self',
        },
        linkTitle: {
            source: 'static',
            value: '',
        },
        iconBefore: {
            source: 'static',
            value: 'none',
        },
        iconAfter: {
            source: 'static',
            value: 'none',
        },
    },
});

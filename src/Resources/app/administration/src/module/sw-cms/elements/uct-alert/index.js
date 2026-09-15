import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'uct-alert',
    label: 'sw-cms.elements.ultimateCmsTools.alert.label',
    component: 'sw-cms-el-uct-alert',
    configComponent: 'sw-cms-el-config-uct-alert',
    previewComponent: 'sw-cms-el-preview-uct-alert',
    defaultConfig: {
        message: { source: 'static', value: '' },
        type: { source: 'static', value: 'info' },
        dismissible: { source: 'static', value: false },
        showIcon: { source: 'static', value: false },
    },
});

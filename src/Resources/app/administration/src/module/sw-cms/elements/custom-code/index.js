import './component/sw-cms-el-custom-code';
import './config/sw-cms-el-config-custom-code';
import './preview/sw-cms-el-preview-custom-code';

Shopware.Service('cmsService').registerCmsElement({
    name: 'custom-code',
    label: 'sw-cms.elements.ultimateCmsTools.customCode.label',
    component: 'sw-cms-el-custom-code',
    configComponent: 'sw-cms-el-config-custom-code',
    previewComponent: 'sw-cms-el-preview-custom-code',
    defaultConfig: {
        uctIntroText: { source: 'static', value: '' },
        uctOutroText: { source: 'static', value: '' },
        cssCode: {
            source: 'static',
            value: '',
        },
        jsCode: {
            source: 'static',
            value: '',
        },
    },
});

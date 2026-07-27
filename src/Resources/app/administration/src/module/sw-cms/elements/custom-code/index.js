import './component/sw-cms-el-custom-code';
import './config/sw-cms-el-config-custom-code';
import './preview/sw-cms-el-preview-custom-code';

Shopware.Service('cmsService').registerCmsElement({
    name: 'custom-code',
    label: 'sw-cms.elements.customCode.label',
    component: 'sw-cms-el-custom-code',
    configComponent: 'sw-cms-el-config-custom-code',
    previewComponent: 'sw-cms-el-preview-custom-code',
    defaultConfig: {
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

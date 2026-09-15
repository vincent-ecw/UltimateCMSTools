import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'uct-single-product',
    label: 'sw-cms.elements.ultimateCmsTools.singleProduct.label',
    component: 'sw-cms-el-uct-single-product',
    configComponent: 'sw-cms-el-config-uct-single-product',
    previewComponent: 'sw-cms-el-preview-uct-single-product',
    defaultConfig: {
        product: { source: 'static', value: null, entity: { name: 'product' } },
        showVariants: { source: 'static', value: false },
        boxLayout: { source: 'static', value: 'standard' },
        displayMode: { source: 'static', value: 'contain' },
        verticalAlign: { source: 'static', value: null },
    },
});

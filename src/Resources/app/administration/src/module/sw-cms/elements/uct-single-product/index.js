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
        badge1DarkText: { source: 'static', value: false },
        badge1Text: { source: 'static', value: '' },
        badge1Color: { source: 'static', value: 'primary' },
        badge2DarkText: { source: 'static', value: false },
        badge2Text: { source: 'static', value: '' },
        badge2Color: { source: 'static', value: 'secondary' },

        product: { source: 'static', value: null, entity: { name: 'product' } },
        showVariants: { source: 'static', value: false },
        boxLayout: { source: 'static', value: 'standard' },
        displayMode: { source: 'static', value: 'contain' },
        verticalAlign: { source: 'static', value: null },
    },
});

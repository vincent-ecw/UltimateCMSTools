import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'uct-single-product',
    label: 'sw-cms.blocks.ultimateCmsTools.singleProduct.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-uct-single-product',
    previewComponent: 'sw-cms-preview-uct-single-product',
    defaultConfig: {
        marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '20px', sizingMode: 'boxed',
    },
    slots: { content: 'uct-single-product' },
});

import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'related-products',
    label: 'sw-cms.blocks.ultimateCmsTools.relatedProducts.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-related-products',
    previewComponent: 'sw-cms-preview-related-products',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'related-products',
    },
});

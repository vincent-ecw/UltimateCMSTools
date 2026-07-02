import './component/sw-cms-block-custom-product-carousel';
import './preview/sw-cms-preview-custom-product-carousel';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'custom-product-carousel',
    label: 'sw-cms.blocks.ultimateCmsTools.customProductCarousel.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-custom-product-carousel',
    previewComponent: 'sw-cms-preview-custom-product-carousel',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'custom-product-carousel',
    },
});

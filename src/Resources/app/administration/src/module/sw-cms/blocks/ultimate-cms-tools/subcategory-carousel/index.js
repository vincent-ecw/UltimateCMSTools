import './component/sw-cms-block-subcategory-carousel';
import './preview/sw-cms-preview-subcategory-carousel';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'subcategory-carousel',
    label: 'sw-cms.blocks.ultimateCmsTools.subcategoryCarousel.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-subcategory-carousel',
    previewComponent: 'sw-cms-preview-subcategory-carousel',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'subcategory-carousel',
    },
});

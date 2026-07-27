import './component/sw-cms-block-manufacturer-carousel';
import './preview/sw-cms-preview-manufacturer-carousel';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'manufacturer-carousel',
    label: 'sw-cms.blocks.ultimateCmsTools.manufacturerCarousel.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-manufacturer-carousel',
    previewComponent: 'sw-cms-preview-manufacturer-carousel',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'manufacturer-carousel',
    },
});

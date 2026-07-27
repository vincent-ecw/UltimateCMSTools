import './component/sw-cms-block-custom-carousel';
import './preview/sw-cms-preview-custom-carousel';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'custom-carousel',
    label: 'sw-cms.blocks.ultimateCmsTools.customCarousel.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-custom-carousel',
    previewComponent: 'sw-cms-preview-custom-carousel',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'custom-carousel',
    },
});

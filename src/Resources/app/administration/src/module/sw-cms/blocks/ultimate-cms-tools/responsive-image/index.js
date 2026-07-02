import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'responsive-image',
    label: 'sw-cms.blocks.ultimateCmsTools.responsiveImage.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-responsive-image',
    previewComponent: 'sw-cms-preview-responsive-image',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'responsive-image',
    },
});

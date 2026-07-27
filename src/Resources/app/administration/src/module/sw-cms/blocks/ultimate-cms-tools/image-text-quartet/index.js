import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'image-text-quartet',
    label: 'sw-cms.blocks.ultimateCmsTools.imageTextQuartet.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-image-text-quartet',
    previewComponent: 'sw-cms-preview-image-text-quartet',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'image-text-quartet',
    },
});

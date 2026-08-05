import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'flexible-image-text',
    label: 'sw-cms.blocks.ultimateCmsTools.flexibleImageText.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-flexible-image-text',
    previewComponent: 'sw-cms-preview-flexible-image-text',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'flexible-image-text',
    },
});

import './component/sw-cms-block-custom-code';
import './preview/sw-cms-preview-custom-code';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'custom-code',
    label: 'sw-cms.blocks.ultimateCmsTools.customCode.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-custom-code',
    previewComponent: 'sw-cms-preview-custom-code',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'custom-code',
    },
});

import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'cta',
    label: 'sw-cms.blocks.ultimateCmsTools.cta.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-cta',
    previewComponent: 'sw-cms-preview-cta',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'cta',
    },
});

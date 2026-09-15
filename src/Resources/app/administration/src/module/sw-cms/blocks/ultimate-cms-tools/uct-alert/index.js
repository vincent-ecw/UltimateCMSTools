import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'uct-alert',
    label: 'sw-cms.blocks.ultimateCmsTools.alert.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-uct-alert',
    previewComponent: 'sw-cms-preview-uct-alert',
    defaultConfig: {
        marginTop: '20px',
        marginBottom: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: { content: 'uct-alert' },
});

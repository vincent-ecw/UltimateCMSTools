import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'statistics',
    label: 'sw-cms.blocks.ultimateCmsTools.statistics.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-statistics',
    previewComponent: 'sw-cms-preview-statistics',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'statistics',
    },
});

import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'icon-list',
    label: 'sw-cms.blocks.ultimateCmsTools.iconList.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-icon-list',
    previewComponent: 'sw-cms-preview-icon-list',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'icon-list',
    },
});

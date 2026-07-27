import './component/sw-cms-block-manufacturer-grid';
import './preview/sw-cms-preview-manufacturer-grid';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'manufacturer-grid',
    label: 'sw-cms.blocks.ultimateCmsTools.manufacturerGrid.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-manufacturer-grid',
    previewComponent: 'sw-cms-preview-manufacturer-grid',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'manufacturer-grid',
    },
});

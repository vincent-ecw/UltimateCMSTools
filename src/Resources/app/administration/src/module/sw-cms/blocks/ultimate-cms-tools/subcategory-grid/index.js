import './component/sw-cms-block-subcategory-grid';
import './preview/sw-cms-preview-subcategory-grid';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'subcategory-grid',
    label: 'sw-cms.blocks.ultimateCmsTools.subcategoryGrid.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-subcategory-grid',
    previewComponent: 'sw-cms-preview-subcategory-grid',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'subcategory-grid',
    },
});

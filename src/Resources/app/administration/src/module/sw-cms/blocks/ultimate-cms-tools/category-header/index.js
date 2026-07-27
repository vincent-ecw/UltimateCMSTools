import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'category-header',
    label: 'sw-cms.blocks.ultimateCmsTools.categoryHeader.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-category-header',
    previewComponent: 'sw-cms-preview-category-header',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'category-header',
    },
});

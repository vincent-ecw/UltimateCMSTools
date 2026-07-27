import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'magazine-quote',
    label: 'sw-cms.blocks.ultimateCmsTools.magazineQuote.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-magazine-quote',
    previewComponent: 'sw-cms-preview-magazine-quote',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'magazine-quote',
    },
});

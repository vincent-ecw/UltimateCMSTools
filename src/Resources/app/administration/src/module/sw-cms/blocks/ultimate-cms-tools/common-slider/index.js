import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'common-slider',
    label: 'sw-cms.blocks.ultimateCmsTools.commonSlider.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-common-slider',
    previewComponent: 'sw-cms-preview-common-slider',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        content: 'common-slider',
    },
});

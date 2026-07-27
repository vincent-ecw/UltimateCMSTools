import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'category-header',
    label: 'sw-cms.elements.ultimateCmsTools.categoryHeader.label',
    component: 'sw-cms-el-category-header',
    configComponent: 'sw-cms-el-config-category-header',
    previewComponent: 'sw-cms-el-preview-category-header',
    defaultConfig: {
        design: {
            source: 'static',
            value: 'design-1',
        },
        title: {
            source: 'static',
            value: '',
        },
        subtitle: {
            source: 'static',
            value: '',
        },
        description: {
            source: 'static',
            value: '',
        },
        media: {
            source: 'static',
            value: null,
            entity: 'media',
        },
    },
});

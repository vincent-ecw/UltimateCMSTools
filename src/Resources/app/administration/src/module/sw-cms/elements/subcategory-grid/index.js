import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'subcategory-grid',
    label: 'sw-cms.elements.ultimateCmsTools.subcategoryGrid.label',
    component: 'sw-cms-el-subcategory-grid',
    configComponent: 'sw-cms-el-config-subcategory-grid',
    previewComponent: 'sw-cms-el-preview-subcategory-grid',
    defaultConfig: {
        showAllSubcategories: {
            source: 'static',
            value: false
        },
        displayImage: {
            source: 'static',
            value: true
        },
        displayDescription: {
            source: 'static',
            value: true
        },
        columnsMobile: {
            source: 'static',
            value: '1'
        }
    }
});

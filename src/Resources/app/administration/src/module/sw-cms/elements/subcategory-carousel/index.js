import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'subcategory-carousel',
    label: 'sw-cms.elements.subcategoryCarousel.label',
    component: 'sw-cms-el-subcategory-carousel',
    configComponent: 'sw-cms-el-config-subcategory-carousel',
    previewComponent: 'sw-cms-el-preview-subcategory-carousel',
    defaultConfig: {
        showAllSubcategories: {
            source: 'static',
            value: false
        }
    }
});

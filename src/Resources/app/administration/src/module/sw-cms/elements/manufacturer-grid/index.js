import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'manufacturer-grid',
    label: 'sw-cms.elements.ultimateCmsTools.manufacturerGrid.label',
    component: 'sw-cms-el-manufacturer-grid',
    configComponent: 'sw-cms-el-config-manufacturer-grid',
    previewComponent: 'sw-cms-el-preview-manufacturer-grid',
    defaultConfig: {
        displayLogo: {
            source: 'static',
            value: true
        },
        displayTitle: {
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

import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'flexible-image-text',
    label: 'sw-cms.elements.ultimateCmsTools.flexibleImageText.label',
    component: 'sw-cms-el-flexible-image-text',
    configComponent: 'sw-cms-el-config-flexible-image-text',
    previewComponent: 'sw-cms-el-preview-flexible-image-text',
    defaultConfig: {
        media: {
            source: 'static',
            value: null,
            entity: 'media',
        },
        content: {
            source: 'static',
            value: '<h2>Hier komt een koptitel</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum arcu magna, eget vehicula libero congue sit amet.</p>',
        },
        caption: {
            source: 'static',
            value: '',
        },
        position: {
            source: 'static',
            value: 'image-left',
        },
        columnSize: {
            source: 'static',
            value: '50-50',
        },
        animation: {
            source: 'static',
            value: 'none',
        },
        theme: {
            source: 'static',
            value: 'traditional',
        },
    },
});

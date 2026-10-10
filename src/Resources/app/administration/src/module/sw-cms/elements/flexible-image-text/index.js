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
        uctIntroText: { source: 'static', value: '' },
        uctOutroText: { source: 'static', value: '' },
        media: {
            source: 'static',
            value: null,
            entity: 'media',
        },
        content: {
            source: 'static',
            value: '<h2>Hier komt een koptitel</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum arcu magna, eget vehicula libero congue sit amet.</p>',
        },
        readMoreText: {
            source: 'static',
            value: '',
        },
        readMoreButtonStyle: {
            source: 'static',
            value: 'primary',
        },
        readMoreMaxWidth: {
            source: 'static',
            value: '',
        },
        imageLink: { source: 'static', value: '' },
        imageLinkNewTab: { source: 'static', value: false },
        imageLinkLabel: { source: 'static', value: '' },
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

import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'magazine-quote',
    label: 'sw-cms.elements.ultimateCmsTools.magazineQuote.label',
    component: 'sw-cms-el-magazine-quote',
    configComponent: 'sw-cms-el-config-magazine-quote',
    previewComponent: 'sw-cms-el-preview-magazine-quote',
    defaultConfig: {
        quote: {
            source: 'static',
            value: ''
        },
        authorName: {
            source: 'static',
            value: ''
        },
        authorImage: {
            source: 'static',
            value: null,
            entity: 'media'
        },
        style: {
            source: 'static',
            value: 'provia'
        }
    }
});

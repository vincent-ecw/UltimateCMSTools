import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'harmonica-list',
    label: 'sw-cms.elements.harmonicaList.label',
    component: 'sw-cms-el-harmonica-list',
    configComponent: 'sw-cms-el-config-harmonica-list',
    previewComponent: 'sw-cms-el-preview-harmonica-list',
    defaultConfig: {
        theme: {
            source: 'static',
            value: 'clean'
        },
        items: {
            source: 'static',
            value: [
                {
                    icon: 'regular-comments',
                    title: 'Harmonica item 1',
                    content: 'Content for harmonica item 1.'
                },
                {
                    icon: 'regular-question-circle-s',
                    title: 'Harmonica item 2',
                    content: 'Content for harmonica item 2.'
                }
            ]
        }
    }
});

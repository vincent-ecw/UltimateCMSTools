import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'harmonica-list',
    label: 'sw-cms.blocks.ultimateCmsTools.harmonicaList.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-harmonica-list',
    previewComponent: 'sw-cms-preview-harmonica-list',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed',
    },
    slots: {
        title: {
            type: 'text',
            default: {
                config: {
                    content: {
                        source: 'static',
                        value: '<h2 style="text-align: center;">Harmonica List</h2>'
                    }
                }
            }
        },
        harmonica: 'harmonica-list',
    },
});

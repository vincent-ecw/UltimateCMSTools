import './component';
import './preview';

Shopware.Service('cmsService').registerCmsBlock({
    name: 'faq-harmonica',
    label: 'sw-cms.blocks.ultimateCmsTools.faqHarmonica.label',
    category: 'ultimate-cms-tools',
    component: 'sw-cms-block-faq-harmonica',
    previewComponent: 'sw-cms-preview-faq-harmonica',
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
                        value: '<h2 style="text-align: center;">Frequently Asked Questions</h2>'
                    }
                }
            }
        },
        faq: 'faq-harmonica',
    },
});

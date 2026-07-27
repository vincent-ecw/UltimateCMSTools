import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'faq-harmonica',
    label: 'sw-cms.elements.faqHarmonica.label',
    component: 'sw-cms-el-faq-harmonica',
    configComponent: 'sw-cms-el-config-faq-harmonica',
    previewComponent: 'sw-cms-el-preview-faq-harmonica',
    defaultConfig: {
        faqs: {
            source: 'static',
            value: [
                {
                    icon: 'regular-comments',
                    title: 'What is your return policy?',
                    content: 'You can return any item within 30 days of purchase.'
                },
                {
                    icon: 'regular-question-circle-s',
                    title: 'How long does shipping take?',
                    content: 'Standard shipping takes 3-5 business days.'
                }
            ]
        }
    }
});

import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'statistics',
    label: 'sw-cms.elements.ultimateCmsTools.statistics.label',
    component: 'sw-cms-el-statistics',
    configComponent: 'sw-cms-el-config-statistics',
    previewComponent: 'sw-cms-el-preview-statistics',
    defaultConfig: {
        theme: {
            source: 'static',
            value: 'boxed',
        },
        introText: {
            source: 'static',
            value: 'We cut through complexity, empowering businesses to challenge the status quo, create unlimited opportunities – and change the world.',
        },
        columns: {
            source: 'static',
            value: '3',
        },
        items: {
            source: 'static',
            value: [
                {
                    icon: 'avatar-multiple',
                    title: 'Partners',
                    number: '2,000+',
                    subline: 'Preline partners',
                },
                {
                    icon: 'speech-bubbles',
                    title: 'Happy Customers',
                    number: '85%',
                    subline: 'Happy customers this year',
                },
                {
                    icon: 'money-card',
                    title: 'Ad Budget',
                    number: '$55M+',
                    subline: 'Ads managed yearly',
                },
            ],
        },
    },
});

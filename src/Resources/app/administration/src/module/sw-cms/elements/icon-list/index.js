import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'icon-list',
    label: 'sw-cms.elements.ultimateCmsTools.iconList.label',
    component: 'sw-cms-el-icon-list',
    configComponent: 'sw-cms-el-config-icon-list',
    previewComponent: 'sw-cms-el-preview-icon-list',
    defaultConfig: {
        layout: {
            source: 'static',
            value: 'horizontal',
        },
        animation: {
            source: 'static',
            value: 'none',
        },
        items: {
            source: 'static',
            value: [
                {
                    icon: 'regular-rocket',
                    customIconClass: '',
                    title: 'Launch within 1 week',
                    text: 'You can start within one week after ordering',
                    url: '',
                    target: '_self',
                },
                {
                    icon: 'regular-cog',
                    customIconClass: '',
                    title: 'Technician on site',
                    text: 'Always a trained technician on site for all your support',
                    url: '',
                    target: '_self',
                },
                {
                    icon: 'regular-trophy',
                    customIconClass: '',
                    title: 'Price winning solution',
                    text: 'We have received a lot of prices with our product',
                    url: '',
                    target: '_self',
                },
                {
                    icon: 'regular-users',
                    customIconClass: '',
                    title: 'Community driven',
                    text: 'The user community decides what should come next',
                    url: '',
                    target: '_self',
                },
            ],
        },
    },
});

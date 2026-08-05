import template from './sw-cms-el-icon-list.html.twig';
import './sw-cms-el-icon-list.scss';

Shopware.Component.register('sw-cms-el-icon-list', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element'),
    ],

    computed: {
        layout() {
            return this.element?.config?.layout?.value || 'horizontal';
        },

        animation() {
            return this.element?.config?.animation?.value || 'none';
        },

        items() {
            return this.element?.config?.items?.value || [];
        },

        layoutClass() {
            return `sw-cms-el-icon-list--${this.layout}`;
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('icon-list');
        },
    },
});

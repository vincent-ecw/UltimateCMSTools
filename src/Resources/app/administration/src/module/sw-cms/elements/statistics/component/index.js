import template from './sw-cms-el-statistics.html.twig';
import './sw-cms-el-statistics.scss';

Shopware.Component.register('sw-cms-el-statistics', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element'),
    ],

    computed: {
        theme() {
            return this.element?.config?.theme?.value || 'boxed';
        },

        introText() {
            return this.element?.config?.introText?.value || '';
        },

        columns() {
            return this.element?.config?.columns?.value || '3';
        },

        items() {
            return this.element?.config?.items?.value || [];
        },

        themeClass() {
            return `sw-cms-el-statistics--theme-${this.theme}`;
        },

        gridStyle() {
            return {
                gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
            };
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('statistics');
        },
    },
});

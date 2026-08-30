import template from './sw-cms-el-harmonica-list.html.twig';
import './sw-cms-el-harmonica-list.scss';

Shopware.Component.register('sw-cms-el-harmonica-list', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    computed: {
        currentTheme() {
            return this.element?.config?.theme?.value || 'clean';
        },

        items() {
            return this.element?.config?.items?.value || [];
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('harmonica-list');
        }
    }
});

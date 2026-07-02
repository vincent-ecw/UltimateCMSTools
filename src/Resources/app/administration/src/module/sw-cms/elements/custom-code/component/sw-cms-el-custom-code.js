import template from './sw-cms-el-custom-code.html.twig';
import './sw-cms-el-custom-code.scss';

Shopware.Component.register('sw-cms-el-custom-code', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element'),
    ],

    computed: {
        cssCode() {
            return this.element.config.cssCode.value;
        },

        jsCode() {
            return this.element.config.jsCode.value;
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('custom-code');
        },
    },
});

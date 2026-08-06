import template from './sw-cms-el-config-custom-code.html.twig';

Shopware.Component.register('sw-cms-el-config-custom-code', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element'),
    ],

    computed: {
        cssCode: {
            get() {
                return this.element?.config?.cssCode?.value || '';
            },
            set(value) {
                this.element.config.cssCode.value = value;
                this.onChange();
            },
        },

        jsCode: {
            get() {
                return this.element?.config?.jsCode?.value || '';
            },
            set(value) {
                this.element.config.jsCode.value = value;
                this.onChange();
            },
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

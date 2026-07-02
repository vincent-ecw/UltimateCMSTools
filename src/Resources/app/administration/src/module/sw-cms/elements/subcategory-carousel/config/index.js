import template from './sw-cms-el-config-subcategory-carousel.html.twig';

Shopware.Component.register('sw-cms-el-config-subcategory-carousel', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    computed: {
        showAllSubcategories: {
            get() {
                return this.element.config?.showAllSubcategories?.value || false;
            },
            set(value) {
                this.element.config.showAllSubcategories.value = value;
                this.$emit('element-update', this.element);
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('subcategory-carousel');
        }
    }
});

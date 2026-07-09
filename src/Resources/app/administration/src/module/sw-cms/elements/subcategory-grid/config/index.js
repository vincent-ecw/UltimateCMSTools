import template from './sw-cms-el-config-subcategory-grid.html.twig';

Shopware.Component.register('sw-cms-el-config-subcategory-grid', {
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
                this.onChange();
            }
        },
        displayImage: {
            get() {
                return this.element.config?.displayImage?.value ?? true;
            },
            set(value) {
                this.element.config.displayImage.value = value;
                this.onChange();
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('subcategory-grid');
        },
        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

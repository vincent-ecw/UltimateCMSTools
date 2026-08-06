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
        },
        displayDescription: {
            get() {
                return this.element.config?.displayDescription?.value ?? true;
            },
            set(value) {
                this.element.config.displayDescription.value = value;
                this.onChange();
            }
        },
        columnsMobileOptions() {
            return [
                {
                    value: '1',
                    label: this.$tc('sw-cms.elements.ultimateCmsTools.subcategoryGrid.config.columnsMobile1')
                },
                {
                    value: '2',
                    label: this.$tc('sw-cms.elements.ultimateCmsTools.subcategoryGrid.config.columnsMobile2')
                }
            ];
        },
        columnsMobile: {
            get() {
                return this.element.config?.columnsMobile?.value ?? '1';
            },
            set(value) {
                this.element.config.columnsMobile.value = value;
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

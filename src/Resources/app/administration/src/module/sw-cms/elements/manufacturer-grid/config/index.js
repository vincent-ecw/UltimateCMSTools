import template from './sw-cms-el-config-manufacturer-grid.html.twig';

Shopware.Component.register('sw-cms-el-config-manufacturer-grid', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    computed: {
        displayLogo: {
            get() {
                return this.element.config?.displayLogo?.value ?? true;
            },
            set(value) {
                this.element.config.displayLogo.value = value;
                this.onChange();
            }
        },

        displayTitle: {
            get() {
                return this.element.config?.displayTitle?.value ?? true;
            },
            set(value) {
                this.element.config.displayTitle.value = value;
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
                    label: this.$tc('sw-cms.elements.ultimateCmsTools.manufacturerGrid.config.columnsMobile1')
                },
                {
                    value: '2',
                    label: this.$tc('sw-cms.elements.ultimateCmsTools.manufacturerGrid.config.columnsMobile2')
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
            this.initElementConfig('manufacturer-grid');
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

import template from './sw-cms-el-config-subcategory-carousel.html.twig';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-subcategory-carousel', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
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
        dotsPositionOptions() {
            return [
                {
                    value: 'inside',
                    label: this.$tc('sw-cms.elements.ultimateCmsTools.commonSlider.config.positionInside')
                },
                {
                    value: 'outside',
                    label: this.$tc('sw-cms.elements.ultimateCmsTools.commonSlider.config.positionOutside')
                }
            ];
        }
    },

    watch: {
        'element.config': {
            handler() {
                this.onChange();
            },
            deep: true
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('subcategory-carousel');
        },
        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

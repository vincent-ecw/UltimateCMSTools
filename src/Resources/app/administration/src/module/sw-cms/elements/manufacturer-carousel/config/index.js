import template from './sw-cms-el-config-manufacturer-carousel.html.twig';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-manufacturer-carousel', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
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
        },

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
        }
    },

    watch: {
        'element.config': {
            handler() {
                this.$emit('element-update', this.element);
            },
            deep: true
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('manufacturer-carousel');
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

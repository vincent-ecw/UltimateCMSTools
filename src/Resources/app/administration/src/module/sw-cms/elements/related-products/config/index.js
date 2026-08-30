import template from './sw-cms-el-config-related-products.html.twig';
import './sw-cms-el-config-related-products.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-related-products', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    data() {
        return {
            activeTab: 'content'
        };
    },

    computed: {
        carouselIndex: {
            get() {
                return this.element?.config?.carouselIndex?.value || 'all';
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.carouselIndex) {
                    this.element.config.carouselIndex = { source: 'static', value: 'all' };
                }
                this.element.config.carouselIndex.value = value;
                this.onChange();
            }
        },

        navigationArrows: {
            get() {
                return this.element?.config?.navigationArrows?.value ?? true;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.navigationArrows) {
                    this.element.config.navigationArrows = { source: 'static', value: true };
                }
                this.element.config.navigationArrows.value = value;
                this.onChange();
            }
        },

        navigationDots: {
            get() {
                return this.element?.config?.navigationDots?.value ?? true;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.navigationDots) {
                    this.element.config.navigationDots = { source: 'static', value: true };
                }
                this.element.config.navigationDots.value = value;
                this.onChange();
            }
        },

        navigationDotsPosition: {
            get() {
                return this.element?.config?.navigationDotsPosition?.value || 'inside';
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.navigationDotsPosition) {
                    this.element.config.navigationDotsPosition = { source: 'static', value: 'inside' };
                }
                this.element.config.navigationDotsPosition.value = value;
                this.onChange();
            }
        },

        autoplay: {
            get() {
                return this.element?.config?.autoplay?.value ?? true;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.autoplay) {
                    this.element.config.autoplay = { source: 'static', value: true };
                }
                this.element.config.autoplay.value = value;
                this.onChange();
            }
        },

        autoplaySpeed: {
            get() {
                return this.element?.config?.autoplaySpeed?.value || 5000;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.autoplaySpeed) {
                    this.element.config.autoplaySpeed = { source: 'static', value: 5000 };
                }
                this.element.config.autoplaySpeed.value = value;
                this.onChange();
            }
        },

        maxHeight: {
            get() {
                return this.element?.config?.maxHeight?.value || null;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.maxHeight) {
                    this.element.config.maxHeight = { source: 'static', value: null };
                }
                this.element.config.maxHeight.value = value;
                this.onChange();
            }
        },

        carouselIndexOptions() {
            return [
                { value: 'all', label: this.$tc('sw-cms.elements.relatedProducts.config.carouselIndexOptions.all') },
                { value: '1', label: this.$tc('sw-cms.elements.relatedProducts.config.carouselIndexOptions.one') },
                { value: '2', label: this.$tc('sw-cms.elements.relatedProducts.config.carouselIndexOptions.two') },
                { value: '3', label: this.$tc('sw-cms.elements.relatedProducts.config.carouselIndexOptions.three') },
                { value: '4', label: this.$tc('sw-cms.elements.relatedProducts.config.carouselIndexOptions.four') },
                { value: '5', label: this.$tc('sw-cms.elements.relatedProducts.config.carouselIndexOptions.five') }
            ];
        },

        dotsPositionOptions() {
            return [
                { value: 'inside', label: this.$tc('sw-cms.elements.relatedProducts.config.dotsPositions.inside') },
                { value: 'outside', label: this.$tc('sw-cms.elements.relatedProducts.config.dotsPositions.outside') }
            ];
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('related-products');
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

import template from './sw-cms-el-custom-product-carousel.html.twig';
import './sw-cms-el-custom-product-carousel.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-custom-product-carousel', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        demoProductElement() {
            return {
                config: {
                    boxLayout: {
                        source: 'static',
                        value: 'standard',
                    },
                    displayMode: {
                        source: 'static',
                        value: 'standard',
                    },
                },
                data: null,
            };
        },

        products() {
            if (this.element?.data?.products && this.element.data.products.length > 0) {
                return this.element.data.products;
            }
            return null;
        },

        hasNavigationArrows() {
            return this.element?.config?.navigationArrows?.value;
        },

        hasNavigationDots() {
            return this.element?.config?.navigationDots?.value;
        },

        dotsPosition() {
            return this.element?.config?.navigationDotsPosition?.value || 'inside';
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('custom-product-carousel');
            this.initElementData('custom-product-carousel');
        },

        getProductEl(product) {
            return {
                config: {
                    boxLayout: {
                        source: 'static',
                        value: 'standard',
                    },
                    displayMode: {
                        source: 'static',
                        value: 'standard',
                    },
                },
                data: {
                    product,
                },
            };
        }
    }
});

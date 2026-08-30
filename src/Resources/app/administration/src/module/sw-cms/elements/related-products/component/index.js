import template from './sw-cms-el-related-products.html.twig';
import './sw-cms-el-related-products.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-related-products', {
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

        carouselIndex() {
            return this.element?.config?.carouselIndex?.value || 'all';
        },

        displayCategories() {
            if (this.carouselIndex === 'all') {
                return [
                    { title: this.$tc('sw-cms.elements.relatedProducts.preview.category1'), id: 1 },
                    { title: this.$tc('sw-cms.elements.relatedProducts.preview.category2'), id: 2 }
                ];
            }

            const idx = parseInt(this.carouselIndex, 10) || 1;
            return [
                {
                    title: this.$tc(`sw-cms.elements.relatedProducts.preview.category${idx}`) || `${this.$tc('sw-cms.elements.relatedProducts.preview.categoryPrefix')} ${idx}`,
                    id: idx
                }
            ];
        },

        hasNavigationArrows() {
            return this.element?.config?.navigationArrows?.value ?? true;
        },

        hasNavigationDots() {
            return this.element?.config?.navigationDots?.value ?? true;
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
            this.initElementConfig('related-products');
            this.initElementData('related-products');
        }
    }
});

import template from './sw-cms-el-custom-carousel.html.twig';
import './sw-cms-el-custom-carousel.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-custom-carousel', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        carouselItems() {
            if (this.element.config && this.element.config.carouselItems && this.element.config.carouselItems.value) {
                return this.element.config.carouselItems.value;
            }
            return [];
        },

        firstImage() {
            if (this.carouselItems.length > 0 && this.carouselItems[0].mediaId) {
                return this.carouselItems[0].mediaId;
            }
            return null;
        },

        firstTitle() {
            if (this.carouselItems.length > 0 && this.carouselItems[0].title) {
                return this.carouselItems[0].title;
            }
            return '';
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('custom-carousel');
        }
    }
});

import template from './sw-cms-el-common-slider.html.twig';
import './sw-cms-el-common-slider.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-common-slider', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        sliderItems() {
            if (this.element.config && this.element.config.sliderItems && this.element.config.sliderItems.value) {
                return this.element.config.sliderItems.value;
            }
            return [];
        },

        firstImage() {
            if (this.sliderItems.length > 0 && this.sliderItems[0].mediaIdDesktop) {
                return this.sliderItems[0].mediaIdDesktop;
            }
            return null;
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('common-slider');
        }
    }
});

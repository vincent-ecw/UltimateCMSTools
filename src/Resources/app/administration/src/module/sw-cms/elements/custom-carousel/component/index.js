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

        previewItems() {
            if (this.carouselItems.length > 0) {
                return this.carouselItems.slice(0, 3);
            }
            return [
                { id: '1', title: 'Our Bestsellers', description: 'Sample description text...', category: 'POPULAR', categoryStyle: 'primary', itemDate: 'dd-mm-yyyy' },
                { id: '2', title: 'Dining options', description: 'Sample description text...', category: 'TIP', categoryStyle: 'secondary', itemDate: 'dd-mm-yyyy' },
                { id: '3', title: 'Escape to the country', description: 'Sample description text...', category: 'NEW', categoryStyle: 'tertiary', itemDate: 'dd-mm-yyyy' }
            ];
        },

        currentTheme() {
            if (this.element.config && this.element.config.theme && this.element.config.theme.value) {
                return this.element.config.theme.value;
            }
            return 'classic';
        },

        highlightActiveItem() {
            return !!(this.element.config && this.element.config.highlightActiveItem && this.element.config.highlightActiveItem.value);
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

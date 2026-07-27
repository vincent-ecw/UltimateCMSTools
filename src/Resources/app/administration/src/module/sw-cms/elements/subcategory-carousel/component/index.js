import template from './sw-cms-el-subcategory-carousel.html.twig';
import './sw-cms-el-subcategory-carousel.scss';

Shopware.Component.register('sw-cms-el-subcategory-carousel', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('subcategory-carousel');
        }
    }
});

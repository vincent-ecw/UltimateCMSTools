import template from './sw-cms-el-manufacturer-carousel.html.twig';
import './sw-cms-el-manufacturer-carousel.scss';

Shopware.Component.register('sw-cms-el-manufacturer-carousel', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('manufacturer-carousel');
        }
    }
});

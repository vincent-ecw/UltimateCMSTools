import template from './sw-cms-el-subcategory-grid.html.twig';
import './sw-cms-el-subcategory-grid.scss';

Shopware.Component.register('sw-cms-el-subcategory-grid', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('subcategory-grid');
        }
    }
});

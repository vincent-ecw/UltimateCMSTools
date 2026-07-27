import template from './sw-cms-el-manufacturer-grid.html.twig';
import './sw-cms-el-manufacturer-grid.scss';

Shopware.Component.register('sw-cms-el-manufacturer-grid', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('manufacturer-grid');
        }
    }
});

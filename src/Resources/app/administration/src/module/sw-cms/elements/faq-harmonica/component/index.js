import template from './sw-cms-el-faq-harmonica.html.twig';
import './sw-cms-el-faq-harmonica.scss';

Shopware.Component.register('sw-cms-el-faq-harmonica', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('faq-harmonica');
        }
    }
});

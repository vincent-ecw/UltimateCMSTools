import template from './sw-cms-el-responsive-image.html.twig';
import './sw-cms-el-responsive-image.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-responsive-image', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        mediaDesktop() {
            return this.element?.data?.mediaDesktop || null;
        },

        mediaUrl() {
            if (this.mediaDesktop?.url) {
                return this.mediaDesktop.url;
            }
            return null;
        },

        altText() {
            return this.element?.config?.altText?.value || '';
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('responsive-image');
        }
    }
});

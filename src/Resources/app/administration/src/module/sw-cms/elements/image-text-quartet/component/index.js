import template from './sw-cms-el-image-text-quartet.html.twig';
import './sw-cms-el-image-text-quartet.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-image-text-quartet', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        media1Desktop() {
            return this.element?.data?.media1Desktop || null;
        },

        media1Url() {
            return this.media1Desktop?.url || null;
        },

        altText1() {
            return this.element?.config?.altText1?.value || '';
        },

        text1() {
            return this.element?.config?.text1?.value || '';
        },

        ratio1() {
            return this.element?.config?.ratio1?.value || '50-50';
        },

        media2Desktop() {
            return this.element?.data?.media2Desktop || null;
        },

        media2Url() {
            return this.media2Desktop?.url || null;
        },

        altText2() {
            return this.element?.config?.altText2?.value || '';
        },

        text2() {
            return this.element?.config?.text2?.value || '';
        },

        ratio2() {
            return this.element?.config?.ratio2?.value || '50-50';
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('image-text-quartet');
        }
    }
});

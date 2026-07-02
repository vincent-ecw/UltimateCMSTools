import template from './sw-cms-el-magazine-quote.html.twig';
import './sw-cms-el-magazine-quote.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-magazine-quote', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        quote() {
            return this.element?.config?.quote?.value || '';
        },

        authorName() {
            return this.element?.config?.authorName?.value || '';
        },

        authorImage() {
            return this.element?.data?.authorImage || null;
        },

        authorImageUrl() {
            if (this.authorImage?.url) {
                return this.authorImage.url;
            }
            return null;
        },

        style() {
            return this.element?.config?.style?.value || 'provia';
        },

        styleClass() {
            return `style-${this.style}`;
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('magazine-quote');
        }
    }
});

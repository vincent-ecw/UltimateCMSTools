import template from './sw-cms-el-cta.html.twig';
import './sw-cms-el-cta.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-cta', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        title() {
            return this.element?.config?.title?.value || '';
        },

        subtitle() {
            return this.element?.config?.subtitle?.value || '';
        },

        buttonText() {
            return this.element?.config?.buttonText?.value || '';
        },

        buttonSecondaryText() {
            return this.element?.config?.buttonSecondaryText?.value || '';
        },

        backgroundImage() {
            return this.element?.data?.backgroundImage || null;
        },

        backgroundImageUrl() {
            if (this.backgroundImage?.url) {
                return this.backgroundImage.url;
            }
            return null;
        },

        style() {
            return this.element?.config?.style?.value || 'split-minimal';
        },

        styleClass() {
            return `style-${this.style}`;
        },

        textColor() {
            return this.element?.config?.textColor?.value || 'dark';
        },

        textColorClass() {
            return `text-${this.textColor}`;
        },

        containerStyles() {
            if (this.backgroundImageUrl) {
                return {
                    backgroundImage: `url(${this.backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                };
            }
            return {};
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('cta');
        }
    }
});

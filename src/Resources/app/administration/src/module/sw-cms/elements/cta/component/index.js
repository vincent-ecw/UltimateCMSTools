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

        minHeight() {
            return this.element?.config?.minHeight?.value || '';
        },

        containerStyles() {
            const styles = {};

            if (this.backgroundImageUrl) {
                styles.backgroundImage = `url(${this.backgroundImageUrl})`;
                styles.backgroundSize = 'cover';
                styles.backgroundPosition = 'center';
            }

            if (this.minHeight) {
                const minHeightValue = /^\d+$/.test(String(this.minHeight).trim())
                    ? `${this.minHeight.trim()}px`
                    : this.minHeight;
                styles.minHeight = minHeightValue;
            }

            return styles;
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

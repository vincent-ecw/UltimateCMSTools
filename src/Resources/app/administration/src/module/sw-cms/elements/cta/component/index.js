import template from './sw-cms-el-cta.html.twig';
import './sw-cms-el-cta.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-cta', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

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

        buttonVariant() {
            return this.element?.config?.buttonVariant?.value || 'primary';
        },

        buttonSecondaryVariant() {
            return this.element?.config?.buttonSecondaryVariant?.value || 'secondary';
        },

        buttonVariantClass() {
            return `btn-${this.buttonVariant}`;
        },

        buttonSecondaryVariantClass() {
            return `btn-${this.buttonSecondaryVariant}`;
        },

        layout() {
            return this.element?.config?.layout?.value || 'vertical-inline';
        },

        layoutClass() {
            return `layout-${this.layout}`;
        },

        backgroundImage() {
            return this.element?.data?.backgroundImage || null;
        },

        backgroundImageUrl() {
            if (this.backgroundImage?.url) {
                return this.backgroundImage.url;
            }
            const configMedia = this.element?.config?.backgroundImage?.value;
            if (configMedia && typeof configMedia === 'object' && configMedia.url) {
                return configMedia.url;
            }
            if (typeof configMedia === 'string' && (configMedia.startsWith('http') || configMedia.startsWith('/') || configMedia.startsWith('data:'))) {
                return configMedia;
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
                styles.backgroundImage = `url("${this.backgroundImageUrl}")`;
                styles.backgroundSize = 'cover';
                styles.backgroundPosition = 'center';
                styles.backgroundRepeat = 'no-repeat';
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

    watch: {
        'element.config.backgroundImage.value': {
            handler(newVal) {
                this.loadBackgroundImage(newVal);
            },
            immediate: true
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('cta');
            this.loadBackgroundImage();
        },

        async loadBackgroundImage(bgVal) {
            const mediaId = bgVal !== undefined ? bgVal : this.element?.config?.backgroundImage?.value;
            if (mediaId && typeof mediaId === 'string' && (!this.element?.data?.backgroundImage || this.element.data.backgroundImage.id !== mediaId)) {
                try {
                    const media = await this.mediaRepository.get(mediaId);
                    if (media) {
                        if (!this.element.data) {
                            this.element.data = {};
                        }
                        this.element.data.backgroundImage = media;
                    }
                } catch (e) {
                    // Ignore error
                }
            }
        }
    }
});

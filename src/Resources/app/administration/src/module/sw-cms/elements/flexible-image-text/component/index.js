import template from './sw-cms-el-flexible-image-text.html.twig';
import './sw-cms-el-flexible-image-text.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-flexible-image-text', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        media() {
            return this.element?.data?.media || null;
        },

        mediaUrl() {
            if (this.media?.url) {
                return this.media.url;
            }
            const configMedia = this.element?.config?.media?.value;
            if (configMedia && typeof configMedia === 'object' && configMedia.url) {
                return configMedia.url;
            }
            if (typeof configMedia === 'string' && (configMedia.startsWith('http') || configMedia.startsWith('/') || configMedia.startsWith('data:'))) {
                return configMedia;
            }
            return null;
        },

        content() {
            return this.element?.config?.content?.value || '';
        },

        caption() {
            return this.element?.config?.caption?.value || '';
        },

        position() {
            return this.element?.config?.position?.value || 'image-left';
        },

        columnSize() {
            return this.element?.config?.columnSize?.value || '50-50';
        },

        theme() {
            return this.element?.config?.theme?.value || 'traditional';
        },

        elementClasses() {
            return [
                'sw-cms-el-flexible-image-text',
                `theme-${this.theme}`,
                `position-${this.position}`,
                `col-${this.columnSize}`,
            ];
        },
    },

    watch: {
        'element.config.media.value': {
            handler(newVal) {
                this.loadMedia(newVal);
            },
            immediate: true,
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('flexible-image-text');
            this.initElementData('flexible-image-text');
            this.loadMedia();
        },

        async loadMedia(mediaVal) {
            const mediaId = mediaVal !== undefined ? mediaVal : this.element?.config?.media?.value;
            if (mediaId && typeof mediaId === 'string' && (!this.element?.data?.media || this.element.data.media.id !== mediaId)) {
                try {
                    const mediaEntity = await this.mediaRepository.get(mediaId);
                    if (mediaEntity) {
                        if (!this.element.data) {
                            this.element.data = {};
                        }
                        this.element.data.media = mediaEntity;
                    }
                } catch (e) {
                    // Ignore error
                }
            }
        },
    },
});

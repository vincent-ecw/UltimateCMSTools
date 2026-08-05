import template from './sw-cms-el-config-flexible-image-text.html.twig';
import './sw-cms-el-config-flexible-image-text.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-flexible-image-text', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    data() {
        return {
            activeTab: 'content',
        };
    },

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        media() {
            return this.element?.data?.media || null;
        },

        content: {
            get() {
                return this.element?.config?.content?.value ?? '';
            },
            set(value) {
                if (this.element?.config?.content) {
                    this.element.config.content.value = value ?? '';
                    this.onChange(this.element);
                }
            },
        },

        caption: {
            get() {
                return this.element?.config?.caption?.value ?? '';
            },
            set(value) {
                if (this.element?.config?.caption) {
                    this.element.config.caption.value = value ?? '';
                    this.onChange(this.element);
                }
            },
        },

        position: {
            get() {
                return this.element?.config?.position?.value || 'image-left';
            },
            set(value) {
                if (this.element?.config?.position) {
                    this.element.config.position.value = value || 'image-left';
                    this.onChange(this.element);
                }
            },
        },

        columnSize: {
            get() {
                return this.element?.config?.columnSize?.value || '50-50';
            },
            set(value) {
                if (this.element?.config?.columnSize) {
                    this.element.config.columnSize.value = value || '50-50';
                    this.onChange(this.element);
                }
            },
        },

        animation: {
            get() {
                return this.element?.config?.animation?.value || 'none';
            },
            set(value) {
                if (this.element?.config?.animation) {
                    this.element.config.animation.value = value || 'none';
                    this.onChange(this.element);
                }
            },
        },

        theme: {
            get() {
                return this.element?.config?.theme?.value || 'traditional';
            },
            set(value) {
                if (this.element?.config?.theme) {
                    this.element.config.theme.value = value || 'traditional';
                    this.onChange(this.element);
                }
            },
        },

        positionOptions() {
            return [
                { value: 'image-left', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.positions.imageLeft') },
                { value: 'text-left', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.positions.textLeft') },
            ];
        },

        columnSizeOptions() {
            return [
                { value: '25-75', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.columnSizes.col2575') },
                { value: '33-66', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.columnSizes.col3366') },
                { value: '50-50', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.columnSizes.col5050') },
                { value: '66-33', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.columnSizes.col6633') },
                { value: '75-25', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.columnSizes.col7525') },
            ];
        },

        animationOptions() {
            return [
                { value: 'none', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.animations.none') },
                { value: 'slide', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.animations.slide') },
                { value: 'fade', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.animations.fade') },
                { value: 'zoom', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.animations.zoom') },
            ];
        },

        themeOptions() {
            return [
                { value: 'traditional', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.themes.traditional') },
                { value: 'polaroid', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.themes.polaroid') },
                { value: 'offset', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.themes.offset') },
                { value: 'rounded', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.themes.rounded') },
                { value: 'stacked', label: this.$tc('sw-cms.elements.ultimateCmsTools.flexibleImageText.config.themes.stacked') },
            ];
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        async createdComponent() {
            this.initElementConfig('flexible-image-text');

            if (!this.element.config.media) {
                this.element.config.media = { source: 'static', value: null, entity: 'media' };
            } else if (this.element.config.media.value === undefined) {
                this.element.config.media.value = null;
            }

            const mediaId = this.element?.config?.media?.value;
            if (mediaId && typeof mediaId === 'string' && (!this.element?.data?.media || this.element.data.media.id !== mediaId)) {
                try {
                    const mediaEntity = await this.mediaRepository.get(mediaId);
                    if (mediaEntity) {
                        this.updateElementData(mediaEntity);
                    }
                } catch (e) {
                    // Ignore error
                }
            }
        },

        onImageSelect(media) {
            let mediaEntity = media;
            if (Array.isArray(media) && media.length > 0) {
                mediaEntity = media[0];
            } else if (Array.isArray(media) && media.length === 0) {
                this.onImageRemove();
                return;
            }

            if (mediaEntity && mediaEntity.id) {
                if (!this.element.config.media) {
                    this.element.config.media = { source: 'static', value: mediaEntity.id, entity: 'media' };
                } else {
                    this.element.config.media.value = mediaEntity.id;
                }
                this.updateElementData(mediaEntity);
                this.onChange(this.element);
            }
        },

        onImageRemove() {
            if (!this.element.config.media) {
                this.element.config.media = { source: 'static', value: null, entity: 'media' };
            } else {
                this.element.config.media.value = null;
            }
            this.updateElementData(null);
            this.onChange(this.element);
        },

        async onImageUpload({ targetId }) {
            try {
                const mediaEntity = await this.mediaRepository.get(targetId);
                if (mediaEntity) {
                    this.onImageSelect(mediaEntity);
                }
            } catch (e) {
                // Ignore error
            }
        },

        updateElementData(media = null) {
            if (!this.element.data) {
                this.element.data = {
                    media: media,
                };
                return;
            }

            this.element.data.media = media;
        },

        onContentChange(newContent) {
            this.content = newContent;
        },
    },
});

import template from './sw-cms-el-flexible-image-text.html.twig';
import './sw-cms-el-flexible-image-text.scss';
import '../../../../../../../shared/scss/uct-read-more.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-flexible-image-text', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    data() {
        return { readMoreExpanded: false };
    },

    computed: {
        readMoreText() {
            return this.$sanitize(this.element?.config?.readMoreText?.value || '');
        },

        hasReadMore() {
            const document = new DOMParser().parseFromString(this.readMoreText, 'text/html');
            return document.body.textContent.trim().length > 0;
        },

        readMoreButtonClass() {
            const value = this.element?.config?.readMoreButtonStyle?.value;
            const styles = ['primary', 'secondary', 'outline-primary', 'outline-secondary', 'light', 'dark', 'link'];
            return `btn-${styles.includes(value) ? value : 'primary'}`;
        },

        readMoreStyle() {
            const value = String(this.element?.config?.readMoreMaxWidth?.value || '').trim();
            const match = value.match(/^([0-9]{1,5}(?:\.[0-9]{1,2})?)(px|%)?$/);
            if (!match) {
                return {};
            }
            const number = Number(match[1]);
            const unit = match[2] || 'px';
            return number > 0 && number <= (unit === '%' ? 100 : 10000)
                ? { maxWidth: `${match[1]}${unit}` } : {};
        },

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

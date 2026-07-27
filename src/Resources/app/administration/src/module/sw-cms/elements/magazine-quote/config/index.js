import template from './sw-cms-el-config-magazine-quote.html.twig';
import './sw-cms-el-config-magazine-quote.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-magazine-quote', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },
        
        authorImageId() {
            return this.element.config?.authorImage?.value || null;
        },

        styleOptions() {
            return [
                { value: 'provia', label: this.$tc('sw-cms.elements.ultimateCmsTools.magazineQuote.config.styles.provia') },
                { value: 'velvia', label: this.$tc('sw-cms.elements.ultimateCmsTools.magazineQuote.config.styles.velvia') },
                { value: 'classic-chrome', label: this.$tc('sw-cms.elements.ultimateCmsTools.magazineQuote.config.styles.classicChrome') },
                { value: 'astia', label: this.$tc('sw-cms.elements.ultimateCmsTools.magazineQuote.config.styles.astia') },
                { value: 'acros', label: this.$tc('sw-cms.elements.ultimateCmsTools.magazineQuote.config.styles.acros') }
            ];
        },

        quote: {
            get() {
                return this.element?.config?.quote?.value || '';
            },
            set(value) {
                this.element.config.quote.value = value;
                this.onChange();
            }
        },

        authorName: {
            get() {
                return this.element?.config?.authorName?.value || '';
            },
            set(value) {
                this.element.config.authorName.value = value;
                this.onChange();
            }
        },

        style: {
            get() {
                return this.element?.config?.style?.value || 'provia';
            },
            set(value) {
                this.element.config.style.value = value;
                this.onChange();
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('magazine-quote');
        },

        onImageSelect(media) {
            if (media && media.length > 0) {
                const mediaId = media[0].id;
                this.element.config.authorImage.value = mediaId;
                this.updateElementData(media[0]);
                this.onChange();
            }
        },

        onImageRemove() {
            this.element.config.authorImage.value = null;
            this.updateElementData(null);
            this.onChange();
        },

        async onImageUpload({ targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            this.element.config.authorImage.value = mediaEntity.id;
            this.updateElementData(mediaEntity);
            this.onChange();
        },

        updateElementData(media = null) {
            if (!this.element.data) {
                this.element.data = {};
            }
            this.element.data.authorImage = media;
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

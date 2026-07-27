import template from './sw-cms-el-config-category-header.html.twig';
import './sw-cms-el-config-category-header.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-category-header', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        designOptions() {
            return [
                { value: 'design-1', label: this.$tc('sw-cms.elements.ultimateCmsTools.categoryHeader.config.designs.design1') },
                { value: 'design-2', label: this.$tc('sw-cms.elements.ultimateCmsTools.categoryHeader.config.designs.design2') },
                { value: 'design-3', label: this.$tc('sw-cms.elements.ultimateCmsTools.categoryHeader.config.designs.design3') },
                { value: 'design-4', label: this.$tc('sw-cms.elements.ultimateCmsTools.categoryHeader.config.designs.design4') },
                { value: 'design-5', label: this.$tc('sw-cms.elements.ultimateCmsTools.categoryHeader.config.designs.design5') },
            ];
        },

        mediaId() {
            return this.element?.config?.media?.value || null;
        },

        design: {
            get() {
                return this.element?.config?.design?.value || 'design-1';
            },
            set(value) {
                this.element.config.design.value = value;
                this.onChange();
            },
        },

        title: {
            get() {
                return this.element?.config?.title?.value || '';
            },
            set(value) {
                this.element.config.title.value = value;
                this.onChange();
            },
        },

        subtitle: {
            get() {
                return this.element?.config?.subtitle?.value || '';
            },
            set(value) {
                this.element.config.subtitle.value = value;
                this.onChange();
            },
        },

        description: {
            get() {
                return this.element?.config?.description?.value || '';
            },
            set(value) {
                this.element.config.description.value = value;
                this.onChange();
            },
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('category-header');
        },

        onImageSelect(media) {
            if (media && media.length > 0) {
                const mediaId = media[0].id;
                this.element.config.media.value = mediaId;
                this.updateElementData(media[0]);
                this.onChange();
            }
        },

        onImageRemove() {
            this.element.config.media.value = null;
            this.updateElementData(null);
            this.onChange();
        },

        async onImageUpload({ targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            this.element.config.media.value = mediaEntity.id;
            this.updateElementData(mediaEntity);
            this.onChange();
        },

        updateElementData(media = null) {
            if (!this.element.data) {
                this.element.data = {};
            }
            this.element.data.media = media;
        },

        onChange() {
            this.$emit('element-update', this.element);
        },
    },
});

import template from './sw-cms-el-config-responsive-image.html.twig';
import './sw-cms-el-config-responsive-image.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-responsive-image', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },
        
        mediaDesktopId() {
            return this.element.config?.mediaDesktop?.value || null;
        },
        
        mediaTabletId() {
            return this.element.config?.mediaTablet?.value || null;
        },
        
        mediaMobileId() {
            return this.element.config?.mediaMobile?.value || null;
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('responsive-image');
        },

        onImageSelect(type, media) {
            if (media && media.length > 0) {
                const mediaId = media[0].id;
                this.element.config[`media${type.charAt(0).toUpperCase() + type.slice(1)}`].value = mediaId;
                this.updateElementData(type, media[0]);
                this.onChange();
            }
        },

        onImageRemove(type) {
            this.element.config[`media${type.charAt(0).toUpperCase() + type.slice(1)}`].value = null;
            this.updateElementData(type, null);
            this.onChange();
        },

        async onImageUpload(type, { targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            this.element.config[`media${type.charAt(0).toUpperCase() + type.slice(1)}`].value = mediaEntity.id;
            this.updateElementData(type, mediaEntity);
            this.onChange();
        },

        updateElementData(type, media = null) {
            const key = `media${type.charAt(0).toUpperCase() + type.slice(1)}`;
            if (!this.element.data) {
                this.element.data = {};
            }
            this.element.data = {
                ...this.element.data,
                [key]: media
            };
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

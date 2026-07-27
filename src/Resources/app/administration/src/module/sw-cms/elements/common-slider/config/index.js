import template from './sw-cms-el-config-common-slider.html.twig';
import './sw-cms-el-config-common-slider.scss';

const { Component, Mixin } = Shopware;
const { cloneDeep } = Shopware.Utils.object;

Component.register('sw-cms-el-config-common-slider', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    data() {
        return {
            mediaModalIsOpen: false,
            currentActiveSlideIndex: null,
            currentActiveMediaType: null, // 'desktop', 'tablet', 'mobile'
        };
    },

    computed: {
        sliderItems() {
            if (this.element.config && this.element.config.sliderItems && this.element.config.sliderItems.value) {
                return this.element.config.sliderItems.value;
            }
            return [];
        },
        
        mediaRepository() {
            return this.repositoryFactory.create('media');
        }
    },

    watch: {
        'element.config': {
            handler() {
                this.onChange();
            },
            deep: true
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('common-slider');
        },

        addSlide() {
            const newItem = {
                id: Shopware.Utils.createId(),
                mediaIdDesktop: null,
                mediaIdTablet: null,
                mediaIdMobile: null,
                title: '',
                buttonText: '',
                buttonUrl: '',
                buttonTarget: '_self'
            };
            this.element.config.sliderItems.value.push(newItem);
            this.$emit('element-update', this.element);
        },

        removeSlide(index) {
            this.element.config.sliderItems.value.splice(index, 1);
            this.$emit('element-update', this.element);
        },

        onImageSelect(slide, type, media) {
            if (media && media.length > 0) {
                const mediaId = media[0].id;
                if (type === 'desktop') slide.mediaIdDesktop = mediaId;
                if (type === 'tablet') slide.mediaIdTablet = mediaId;
                if (type === 'mobile') slide.mediaIdMobile = mediaId;
                this.onChange();
            }
        },

        onImageRemove(slide, type) {
            if (type === 'desktop') slide.mediaIdDesktop = null;
            if (type === 'tablet') slide.mediaIdTablet = null;
            if (type === 'mobile') slide.mediaIdMobile = null;
            this.onChange();
        },

        async onImageUpload(slide, type, { targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            if (type === 'desktop') slide.mediaIdDesktop = mediaEntity.id;
            if (type === 'tablet') slide.mediaIdTablet = mediaEntity.id;
            if (type === 'mobile') slide.mediaIdMobile = mediaEntity.id;
            this.onChange();
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

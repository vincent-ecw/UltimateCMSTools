import template from './sw-cms-el-config-custom-carousel.html.twig';
import './sw-cms-el-config-custom-carousel.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-custom-carousel', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    inject: ['repositoryFactory'],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },
        carouselItems() {
            if (this.element.config && this.element.config.carouselItems && this.element.config.carouselItems.value) {
                return this.element.config.carouselItems.value;
            }
            return [];
        },
        dotsPositionOptions() {
            return [
                {
                    value: 'inside',
                    label: this.$tc('sw-cms.elements.customCarousel.config.dotsPositions.inside')
                },
                {
                    value: 'outside',
                    label: this.$tc('sw-cms.elements.customCarousel.config.dotsPositions.outside')
                }
            ];
        }
    },

    watch: {
        'element.config': {
            handler() {
                this.$emit('element-update', this.element);
            },
            deep: true
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('custom-carousel');
        },

        onAddItem() {
            this.element.config.carouselItems.value.push({
                id: Shopware.Utils.createId(),
                title: '',
                description: '',
                mediaId: null,
                buttonUrl: '',
                buttonTarget: '_self'
            });
            this.$emit('element-update', this.element);
        },

        onRemoveItem(index) {
            this.element.config.carouselItems.value.splice(index, 1);
            this.$emit('element-update', this.element);
        },

        async onImageUpload(item, { targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            item.mediaId = mediaEntity.id;
            this.$emit('element-update', this.element);
        },

        onImageSelect(item, mediaEntity) {
            if (mediaEntity && mediaEntity.length > 0) {
                item.mediaId = mediaEntity[0].id;
                this.$emit('element-update', this.element);
            }
        },

        onImageRemove(item) {
            item.mediaId = null;
            this.$emit('element-update', this.element);
        }
    }
});

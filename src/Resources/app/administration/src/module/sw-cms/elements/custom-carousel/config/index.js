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
        },
        themeOptions() {
            return [
                {
                    value: 'classic',
                    label: this.$tc('sw-cms.elements.customCarousel.config.themes.classic')
                },
                {
                    value: 'minimal',
                    label: this.$tc('sw-cms.elements.customCarousel.config.themes.minimal')
                },
                {
                    value: 'category',
                    label: this.$tc('sw-cms.elements.customCarousel.config.themes.category')
                },
                {
                    value: 'horizontal',
                    label: this.$tc('sw-cms.elements.customCarousel.config.themes.horizontal')
                },
                {
                    value: 'media',
                    label: this.$tc('sw-cms.elements.customCarousel.config.themes.media')
                }
            ];
        },
        categoryStyleOptions() {
            return [
                {
                    value: 'primary',
                    label: this.$tc('sw-cms.elements.customCarousel.config.categoryStyles.primary')
                },
                {
                    value: 'secondary',
                    label: this.$tc('sw-cms.elements.customCarousel.config.categoryStyles.secondary')
                },
                {
                    value: 'tertiary',
                    label: this.$tc('sw-cms.elements.customCarousel.config.categoryStyles.tertiary')
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
                buttonTarget: '_self',
                category: '',
                categoryStyle: 'primary',
                itemDate: null,
                showStartDate: null,
                showEndDate: null
            });
            this.$emit('element-update', this.element);
        },

        onRemoveItem(index) {
            this.element.config.carouselItems.value.splice(index, 1);
            this.$emit('element-update', this.element);
        },

        onMoveItemUp(index) {
            if (index <= 0) return;
            const items = this.element.config.carouselItems.value;
            const item = items.splice(index, 1)[0];
            items.splice(index - 1, 0, item);
            this.$emit('element-update', this.element);
        },

        onMoveItemDown(index) {
            const items = this.element.config.carouselItems.value;
            if (index >= items.length - 1) return;
            const item = items.splice(index, 1)[0];
            items.splice(index + 1, 0, item);
            this.$emit('element-update', this.element);
        },

        onDragStart(event, index) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', index);
        },

        onDragOver(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        },

        onDrop(event, targetIndex) {
            event.preventDefault();
            const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
            if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

            const items = this.element.config.carouselItems.value;
            const item = items.splice(sourceIndex, 1)[0];
            items.splice(targetIndex, 0, item);
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

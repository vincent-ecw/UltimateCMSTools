import template from './sw-cms-el-config-image-text-quartet.html.twig';
import './sw-cms-el-config-image-text-quartet.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-image-text-quartet', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        media1DesktopId() {
            return this.element.config?.media1Desktop?.value || null;
        },

        media1TabletId() {
            return this.element.config?.media1Tablet?.value || null;
        },

        media1MobileId() {
            return this.element.config?.media1Mobile?.value || null;
        },

        media2DesktopId() {
            return this.element.config?.media2Desktop?.value || null;
        },

        media2TabletId() {
            return this.element.config?.media2Tablet?.value || null;
        },

        media2MobileId() {
            return this.element.config?.media2Mobile?.value || null;
        },

        ratioOptions() {
            return [
                { value: '50-50', label: this.$tc('sw-cms.elements.ultimateCmsTools.imageTextQuartet.config.ratio50_50') },
                { value: '70-30', label: this.$tc('sw-cms.elements.ultimateCmsTools.imageTextQuartet.config.ratio70_30') },
                { value: '30-70', label: this.$tc('sw-cms.elements.ultimateCmsTools.imageTextQuartet.config.ratio30_70') }
            ];
        },

        altText1: {
            get() {
                return this.element?.config?.altText1?.value || '';
            },
            set(value) {
                this.element.config.altText1.value = value;
                this.onChange();
            }
        },

        text1: {
            get() {
                return this.element?.config?.text1?.value || '';
            },
            set(value) {
                this.element.config.text1.value = value;
                this.onChange();
            }
        },

        ratio1: {
            get() {
                return this.element?.config?.ratio1?.value || '50-50';
            },
            set(value) {
                this.element.config.ratio1.value = value;
                this.onChange();
            }
        },

        altText2: {
            get() {
                return this.element?.config?.altText2?.value || '';
            },
            set(value) {
                this.element.config.altText2.value = value;
                this.onChange();
            }
        },

        text2: {
            get() {
                return this.element?.config?.text2?.value || '';
            },
            set(value) {
                this.element.config.text2.value = value;
                this.onChange();
            }
        },

        ratio2: {
            get() {
                return this.element?.config?.ratio2?.value || '50-50';
            },
            set(value) {
                this.element.config.ratio2.value = value;
                this.onChange();
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('image-text-quartet');
        },

        onImageSelect(rowNum, type, media) {
            if (media && media.length > 0) {
                const mediaId = media[0].id;
                const fieldName = `media${rowNum}${type.charAt(0).toUpperCase() + type.slice(1)}`;
                this.element.config[fieldName].value = mediaId;
                this.updateElementData(fieldName, media[0]);
                this.onChange();
            }
        },

        onImageRemove(rowNum, type) {
            const fieldName = `media${rowNum}${type.charAt(0).toUpperCase() + type.slice(1)}`;
            this.element.config[fieldName].value = null;
            this.updateElementData(fieldName, null);
            this.onChange();
        },

        async onImageUpload(rowNum, type, { targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            const fieldName = `media${rowNum}${type.charAt(0).toUpperCase() + type.slice(1)}`;
            this.element.config[fieldName].value = mediaEntity.id;
            this.updateElementData(fieldName, mediaEntity);
            this.onChange();
        },

        updateElementData(fieldName, media = null) {
            if (!this.element.data) {
                this.element.data = {};
            }
            this.element.data[fieldName] = media;
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

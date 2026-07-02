import template from './sw-cms-el-config-cta.html.twig';
import './sw-cms-el-config-cta.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-cta', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        backgroundImageId() {
            return this.element.config?.backgroundImage?.value || null;
        },

        styleOptions() {
            return [
                { value: 'split-minimal', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.styles.split-minimal') },
                { value: 'neo-brutal', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.styles.neo-brutal') },
                { value: 'glassmorphic', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.styles.glassmorphic') },
                { value: 'hero-spotlight', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.styles.hero-spotlight') },
                { value: 'interactive-card', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.styles.interactive-card') }
            ];
        },

        targetOptions() {
            return [
                { value: '_self', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.targetSelf') },
                { value: '_blank', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.targetBlank') }
            ];
        },

        textColorOptions() {
            return [
                { value: 'dark', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.textColors.dark') },
                { value: 'light', label: this.$tc('sw-cms.elements.ultimateCmsTools.cta.config.textColors.light') }
            ];
        },

        title: {
            get() {
                return this.element?.config?.title?.value || '';
            },
            set(value) {
                this.element.config.title.value = value;
                this.onChange();
            }
        },

        subtitle: {
            get() {
                return this.element?.config?.subtitle?.value || '';
            },
            set(value) {
                this.element.config.subtitle.value = value;
                this.onChange();
            }
        },

        buttonText: {
            get() {
                return this.element?.config?.buttonText?.value || '';
            },
            set(value) {
                this.element.config.buttonText.value = value;
                this.onChange();
            }
        },

        buttonUrl: {
            get() {
                return this.element?.config?.buttonUrl?.value || '';
            },
            set(value) {
                this.element.config.buttonUrl.value = value;
                this.onChange();
            }
        },

        buttonTarget: {
            get() {
                return this.element?.config?.buttonTarget?.value || '_self';
            },
            set(value) {
                this.element.config.buttonTarget.value = value;
                this.onChange();
            }
        },

        buttonSecondaryText: {
            get() {
                return this.element?.config?.buttonSecondaryText?.value || '';
            },
            set(value) {
                this.element.config.buttonSecondaryText.value = value;
                this.onChange();
            }
        },

        buttonSecondaryUrl: {
            get() {
                return this.element?.config?.buttonSecondaryUrl?.value || '';
            },
            set(value) {
                this.element.config.buttonSecondaryUrl.value = value;
                this.onChange();
            }
        },

        buttonSecondaryTarget: {
            get() {
                return this.element?.config?.buttonSecondaryTarget?.value || '_self';
            },
            set(value) {
                this.element.config.buttonSecondaryTarget.value = value;
                this.onChange();
            }
        },

        style: {
            get() {
                return this.element?.config?.style?.value || 'split-minimal';
            },
            set(value) {
                this.element.config.style.value = value;
                this.onChange();
            }
        },

        textColor: {
            get() {
                return this.element?.config?.textColor?.value || 'dark';
            },
            set(value) {
                this.element.config.textColor.value = value;
                this.onChange();
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('cta');
        },

        onImageSelect(media) {
            if (media && media.length > 0) {
                const mediaId = media[0].id;
                this.element.config.backgroundImage.value = mediaId;
                this.updateElementData(media[0]);
                this.onChange();
            }
        },

        onImageRemove() {
            this.element.config.backgroundImage.value = null;
            this.updateElementData(null);
            this.onChange();
        },

        async onImageUpload({ targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            this.element.config.backgroundImage.value = mediaEntity.id;
            this.updateElementData(mediaEntity);
            this.onChange();
        },

        updateElementData(media = null) {
            if (!this.element.data) {
                this.element.data = {};
            }
            this.element.data.backgroundImage = media;
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

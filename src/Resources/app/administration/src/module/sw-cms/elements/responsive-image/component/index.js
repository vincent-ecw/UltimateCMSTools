import template from './sw-cms-el-responsive-image.html.twig';
import './sw-cms-el-responsive-image.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-responsive-image', {
    template,

    inject: [
        'repositoryFactory'
    ],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        currentCmsDeviceView() {
            return this.cmsPageState?.currentCmsDeviceView || 'desktop';
        },

        mediaDesktop() {
            return this.element?.data?.mediaDesktop || null;
        },

        mediaTablet() {
            return this.element?.data?.mediaTablet || null;
        },

        mediaMobile() {
            return this.element?.data?.mediaMobile || null;
        },

        activeMedia() {
            const deviceView = this.currentCmsDeviceView;

            if (deviceView === 'mobile') {
                return this.mediaMobile || this.mediaTablet || this.mediaDesktop;
            }

            if (deviceView === 'tablet-landscape' || deviceView === 'tablet') {
                return this.mediaTablet || this.mediaDesktop || this.mediaMobile;
            }

            return this.mediaDesktop || this.mediaTablet || this.mediaMobile;
        },

        mediaUrl() {
            if (this.activeMedia?.url) {
                return this.activeMedia.url;
            }
            return null;
        },

        activeMediaDeviceLabel() {
            if (!this.activeMedia) {
                return '';
            }

            if (this.activeMedia === this.mediaMobile) {
                return 'Mobile';
            }

            if (this.activeMedia === this.mediaTablet) {
                return 'Tablet';
            }

            return 'Desktop';
        },

        displayInfo() {
            const deviceTag = this.activeMediaDeviceLabel ? ` (${this.activeMediaDeviceLabel})` : '';
            if (this.altText) {
                return `${this.altText}${deviceTag}`;
            }
            return `${this.$tc('sw-cms.elements.ultimateCmsTools.responsiveImage.label')}${deviceTag}`;
        },

        altText() {
            return this.element?.config?.altText?.value || '';
        }
    },

    watch: {
        'element.config': {
            handler() {
                this.loadMediaEntities();
            },
            deep: true
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('responsive-image');
            this.initElementData('responsive-image');
            this.loadMediaEntities();
        },

        async loadMediaEntities() {
            if (!this.element.data) {
                this.element.data = {};
            }

            const mediaKeys = [
                { configKey: 'mediaDesktop', dataKey: 'mediaDesktop' },
                { configKey: 'mediaTablet', dataKey: 'mediaTablet' },
                { configKey: 'mediaMobile', dataKey: 'mediaMobile' }
            ];

            let hasUpdates = false;
            const updatedData = { ...this.element.data };

            for (const item of mediaKeys) {
                const mediaId = this.element?.config?.[item.configKey]?.value;
                const existingData = this.element?.data?.[item.dataKey];

                if (mediaId && (!existingData || !existingData.url)) {
                    try {
                        const mediaEntity = await this.mediaRepository.get(mediaId, Shopware.Context.api);
                        if (mediaEntity) {
                            updatedData[item.dataKey] = mediaEntity;
                            hasUpdates = true;
                        }
                    } catch (e) {
                        // ignore fetch error
                    }
                }
            }

            if (hasUpdates) {
                this.element.data = updatedData;
            }
        }
    }
});

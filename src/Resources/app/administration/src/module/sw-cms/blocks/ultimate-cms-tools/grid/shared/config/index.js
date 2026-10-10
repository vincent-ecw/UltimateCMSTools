import template from './uct-cms-block-columns-config.html.twig';
import './uct-cms-block-columns-config.scss';

const columnCounts = {
    'grid-12': 1,
    'grid-md-6-6': 2,
    'grid-md-4-8': 2,
    'grid-md-8-4': 2,
    'grid-md-3-9': 2,
    'grid-md-9-3': 2,
    'grid-md-4-4-4': 3,
    'grid-md-3-6-3': 3,
    'grid-md-2-8-2': 3,
    'grid-md-3-3-3-3': 4,
    'grid-md-2-2-2-2-2-2': 6,
};

Shopware.Component.register('uct-cms-block-columns-config', {
    template,

    inject: ['repositoryFactory'],

    props: {
        block: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            activeColumn: 1,
            mediaMap: {},
        };
    },

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        cmsPageState() {
            return Shopware.Store.get('cmsPageState') || {};
        },

        columnCount() {
            return columnCounts[this.block?.type] || 2;
        },

        bgModeOptions() {
            return [
                { value: 'cover', label: this.$t('sw-cms.columnConfig.bgModeCover') || 'Cover' },
                { value: 'contain', label: this.$t('sw-cms.columnConfig.bgModeContain') || 'Contain' },
                { value: 'auto', label: this.$t('sw-cms.columnConfig.bgModeAuto') || 'Auto' },
            ];
        },

        hasBackgroundImage() {
            const config = this.getColumnConfig(this.activeColumn);
            return !!(config.backgroundMediaId || config.backgroundMediaUrl);
        },

        colMedia() {
            const mediaId = this.getColumnConfig(this.activeColumn).backgroundMediaId;
            if (!mediaId) {
                return null;
            }

            if (this.mediaMap[mediaId]) {
                return this.mediaMap[mediaId];
            }

            this.loadMedia(mediaId);
            return null;
        },

        colPadding: {
            get() {
                return this.getColumnConfig(this.activeColumn).padding || '';
            },
            set(value) {
                this.setColumnProp('padding', value);
            },
        },

        colBgColor: {
            get() {
                return this.getColumnConfig(this.activeColumn).backgroundColor || '';
            },
            set(value) {
                this.setColumnProp('backgroundColor', value);
            },
        },

        colBgMode: {
            get() {
                return this.getColumnConfig(this.activeColumn).backgroundMediaMode || 'cover';
            },
            set(value) {
                this.setColumnProp('backgroundMediaMode', value);
            },
        },

        colCssClass: {
            get() {
                return this.getColumnConfig(this.activeColumn).cssClass || '';
            },
            set(value) {
                this.setColumnProp('cssClass', value);
            },
        },
    },

    watch: {
        'block.id'() {
            this.activeColumn = 1;
        },
    },

    methods: {
        getColumnConfig(colIndex) {
            return this.block?.customFields?.uct_columns?.['col' + colIndex] || {};
        },

        setColumnProp(prop, value) {
            if (!this.block.customFields) {
                this.block.customFields = {};
            }
            if (!this.block.customFields.uct_columns) {
                this.block.customFields.uct_columns = {};
            }
            const key = 'col' + this.activeColumn;
            if (!this.block.customFields.uct_columns[key]) {
                this.block.customFields.uct_columns[key] = {};
            }

            this.block.customFields.uct_columns[key][prop] = value;
        },

        async loadMedia(mediaId) {
            try {
                const media = await this.mediaRepository.get(mediaId);
                if (media) {
                    this.mediaMap[mediaId] = media;
                }
            } catch (e) {
                // Ignore load error
            }
        },

        onSelectMedia(media) {
            if (media && media.length > 0) {
                const item = media[0];
                this.setColumnProp('backgroundMediaId', item.id);
                this.setColumnProp('backgroundMediaUrl', item.url);
                this.mediaMap[item.id] = item;
            }
        },

        onRemoveMedia() {
            this.setColumnProp('backgroundMediaId', null);
            this.setColumnProp('backgroundMediaUrl', null);
        },

        async onUploadMediaFinish({ targetId }) {
            const media = await this.mediaRepository.get(targetId);
            if (media) {
                this.setColumnProp('backgroundMediaId', media.id);
                this.setColumnProp('backgroundMediaUrl', media.url);
                this.mediaMap[media.id] = media;
            }
        },
    },
});


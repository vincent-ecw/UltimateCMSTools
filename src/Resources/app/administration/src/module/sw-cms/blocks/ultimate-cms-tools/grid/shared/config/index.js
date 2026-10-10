import template from './uct-cms-block-columns-config.html.twig';
import './uct-cms-block-columns-config.scss';

const columnLayouts = {
    'grid-12': [
        { index: 1, label: 'Column 1 (100%)' },
    ],
    'grid-md-6-6': [
        { index: 1, label: 'Column 1 (50%)' },
        { index: 2, label: 'Column 2 (50%)' },
    ],
    'grid-md-4-8': [
        { index: 1, label: 'Column 1 (33%)' },
        { index: 2, label: 'Column 2 (67%)' },
    ],
    'grid-md-8-4': [
        { index: 1, label: 'Column 1 (67%)' },
        { index: 2, label: 'Column 2 (33%)' },
    ],
    'grid-md-3-9': [
        { index: 1, label: 'Column 1 (25%)' },
        { index: 2, label: 'Column 2 (75%)' },
    ],
    'grid-md-9-3': [
        { index: 1, label: 'Column 1 (75%)' },
        { index: 2, label: 'Column 2 (25%)' },
    ],
    'grid-md-4-4-4': [
        { index: 1, label: 'Column 1 (33%)' },
        { index: 2, label: 'Column 2 (33%)' },
        { index: 3, label: 'Column 3 (33%)' },
    ],
    'grid-md-3-6-3': [
        { index: 1, label: 'Column 1 (25%)' },
        { index: 2, label: 'Column 2 (50%)' },
        { index: 3, label: 'Column 3 (25%)' },
    ],
    'grid-md-2-8-2': [
        { index: 1, label: 'Column 1 (17%)' },
        { index: 2, label: 'Column 2 (66%)' },
        { index: 3, label: 'Column 3 (17%)' },
    ],
    'grid-md-3-3-3-3': [
        { index: 1, label: 'Column 1 (25%)' },
        { index: 2, label: 'Column 2 (25%)' },
        { index: 3, label: 'Column 3 (25%)' },
        { index: 4, label: 'Column 4 (25%)' },
    ],
    'grid-md-2-2-2-2-2-2': [
        { index: 1, label: 'Column 1 (17%)' },
        { index: 2, label: 'Column 2 (17%)' },
        { index: 3, label: 'Column 3 (17%)' },
        { index: 4, label: 'Column 4 (17%)' },
        { index: 5, label: 'Column 5 (17%)' },
        { index: 6, label: 'Column 6 (17%)' },
    ],
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
            mediaMap: {},
        };
    },

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        cmsPageState() {
            return Shopware.Store.get('cmsPage') || {};
        },

        columns() {
            const list = columnLayouts[this.block?.type] || [
                { index: 1, label: 'Column 1 (50%)' },
                { index: 2, label: 'Column 2 (50%)' },
            ];

            return list.map((item) => ({
                id: item.index,
                value: item.index,
                label: this.$t('sw-cms.columnConfig.tabTitle', { index: item.index }) + ` (${item.label.split('(')[1] || ''}`,
            }));
        },

        columnCount() {
            return this.columns.length;
        },

        activeColumn: {
            get() {
                const selected = this.block?.customFields?.uct_selected_column;
                if (typeof selected === 'number' && selected >= 1 && selected <= this.columnCount) {
                    return selected;
                }
                return 1;
            },
            set(index) {
                this.initCustomFields();
                this.block.customFields.uct_selected_column = index;
                this.loadColumnMedia(index);
            },
        },

        bgModeOptions() {
            return [
                { id: 1, value: 'cover', label: this.$t('sw-cms.columnConfig.bgModeCover') || 'Cover' },
                { id: 2, value: 'contain', label: this.$t('sw-cms.columnConfig.bgModeContain') || 'Contain' },
                { id: 3, value: 'auto', label: this.$t('sw-cms.columnConfig.bgModeAuto') || 'Auto' },
            ];
        },

        activeColumnConfig() {
            return this.block?.customFields?.uct_columns?.['col' + this.activeColumn] || {};
        },

        hasBackgroundImage() {
            return !!(this.activeColumnConfig.backgroundMediaId || this.activeColumnConfig.backgroundMediaUrl);
        },

        colMedia() {
            const mediaId = this.activeColumnConfig.backgroundMediaId;
            if (!mediaId) {
                return null;
            }
            return this.mediaMap[mediaId] || null;
        },

        colPadding: {
            get() {
                return this.activeColumnConfig.padding || '';
            },
            set(value) {
                this.setColumnProp('padding', value);
            },
        },

        colBgColor: {
            get() {
                return this.activeColumnConfig.backgroundColor || null;
            },
            set(value) {
                this.setColumnProp('backgroundColor', value);
            },
        },

        colBgMode: {
            get() {
                return this.activeColumnConfig.backgroundMediaMode || 'cover';
            },
            set(value) {
                this.setColumnProp('backgroundMediaMode', value);
            },
        },

        colCssClass: {
            get() {
                return this.activeColumnConfig.cssClass || '';
            },
            set(value) {
                this.setColumnProp('cssClass', value);
            },
        },
    },

    watch: {
        'block.id': {
            immediate: true,
            handler() {
                this.initCustomFields();
                this.loadColumnMedia(this.activeColumn);
            },
        },
        activeColumn: {
            immediate: true,
            handler(newCol) {
                this.loadColumnMedia(newCol);
            },
        },
    },

    created() {
        this.initCustomFields();
        this.loadColumnMedia(this.activeColumn);
    },

    methods: {
        initCustomFields() {
            if (!this.block.customFields) {
                this.block.customFields = {};
            }
            if (!this.block.customFields.uct_columns) {
                this.block.customFields.uct_columns = {};
            }
            if (typeof this.block.customFields.uct_selected_column !== 'number') {
                this.block.customFields.uct_selected_column = 1;
            }
        },

        setColumnProp(prop, value) {
            this.initCustomFields();
            const key = 'col' + this.activeColumn;
            if (!this.block.customFields.uct_columns[key]) {
                this.block.customFields.uct_columns[key] = {};
            }

            // Create new object reference to ensure Vue 3 reactivity
            this.block.customFields.uct_columns[key] = {
                ...this.block.customFields.uct_columns[key],
                [prop]: value,
            };
        },

        async loadColumnMedia(colIndex) {
            const colConfig = this.block?.customFields?.uct_columns?.['col' + colIndex];
            const mediaId = colConfig?.backgroundMediaId;
            if (!mediaId || this.mediaMap[mediaId]) {
                return;
            }

            try {
                const media = await this.mediaRepository.get(mediaId);
                if (media) {
                    this.mediaMap = {
                        ...this.mediaMap,
                        [mediaId]: media,
                    };
                }
            } catch (e) {
                // Silently ignore media fetch errors
            }
        },

        onSelectMedia(media) {
            if (media && media.length > 0) {
                const item = media[0];
                this.setColumnProp('backgroundMediaId', item.id);
                this.setColumnProp('backgroundMediaUrl', item.url);
                this.mediaMap = {
                    ...this.mediaMap,
                    [item.id]: item,
                };
            }
        },

        onRemoveMedia() {
            this.setColumnProp('backgroundMediaId', null);
            this.setColumnProp('backgroundMediaUrl', null);
        },

        async onUploadMediaFinish({ targetId }) {
            try {
                const media = await this.mediaRepository.get(targetId);
                if (media) {
                    this.setColumnProp('backgroundMediaId', media.id);
                    this.setColumnProp('backgroundMediaUrl', media.url);
                    this.mediaMap = {
                        ...this.mediaMap,
                        [media.id]: media,
                    };
                }
            } catch (e) {
                // Silently ignore
            }
        },
    },
});

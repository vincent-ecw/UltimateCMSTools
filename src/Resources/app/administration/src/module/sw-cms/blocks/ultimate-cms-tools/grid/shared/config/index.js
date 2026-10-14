import template from './uct-cms-block-columns-config.html.twig';
import './uct-cms-block-columns-config.scss';

import { getColumns } from '../layouts';

Shopware.Component.register('uct-cms-block-columns-config', {
    template,

    inject: ['repositoryFactory', 'acl'],

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
        canEdit() {
            return this.acl.can('cms.editor') && !Shopware.Store.get('cmsPage').currentPage?.locked;
        },

        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        cmsPageState() {
            return Shopware.Store.get('cmsPage') || {};
        },

        columns() {
            return getColumns(this.block?.type).map((item) => ({
                id: item.index,
                value: item.index,
                label: this.$t('sw-cms.columnConfig.tabTitle', { index: item.index }) + ` (${item.label})`,
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
                const customFields = Shopware.Utils.object.cloneDeep(this.block.customFields || {});
                customFields.uct_selected_column = index;
                this.block.customFields = customFields;
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

    methods: {
        initCustomFields() {
            if (!this.canEdit) {
                return;
            }
            if (!this.block.customFields || typeof this.block.customFields !== 'object' || Array.isArray(this.block.customFields)) {
                this.block.customFields = {};
            }
            if (!this.block.customFields.uct_columns || typeof this.block.customFields.uct_columns !== 'object' || Array.isArray(this.block.customFields.uct_columns)) {
                const currentFields = Shopware.Utils.object.cloneDeep(this.block.customFields);
                currentFields.uct_columns = {};
                this.block.customFields = currentFields;
            }
            if (typeof this.block.customFields.uct_selected_column !== 'number') {
                const currentFields = Shopware.Utils.object.cloneDeep(this.block.customFields);
                currentFields.uct_selected_column = 1;
                this.block.customFields = currentFields;
            }
        },

        setColumnProp(prop, value, columnIndex = this.activeColumn) {
            if (!this.canEdit) {
                return;
            }
            this.initCustomFields();

            const customFields = Shopware.Utils.object.cloneDeep(this.block.customFields || {});
            if (!customFields.uct_columns || typeof customFields.uct_columns !== 'object' || Array.isArray(customFields.uct_columns)) {
                customFields.uct_columns = {};
            }

            const key = 'col' + columnIndex;
            if (!customFields.uct_columns[key] || typeof customFields.uct_columns[key] !== 'object' || Array.isArray(customFields.uct_columns[key])) {
                customFields.uct_columns[key] = {};
            }

            customFields.uct_columns[key][prop] = value;

            // Reassign the root customFields on this.block to trigger Shopware DAL Entity proxy setter & _isDirty flag
            this.block.customFields = customFields;
            if ('_isDirty' in this.block) {
                this.block._isDirty = true;
            }
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

        async onUploadMediaFinish({ targetId }, columnIndex) {
            const blockId = this.block.id;
            try {
                const media = await this.mediaRepository.get(targetId);
                if (media && this.block.id === blockId) {
                    this.setColumnProp('backgroundMediaId', media.id, columnIndex);
                    this.setColumnProp('backgroundMediaUrl', media.url, columnIndex);
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

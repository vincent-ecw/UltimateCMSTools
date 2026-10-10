import template from './sw-cms-block-grid-base.html.twig';
import './sw-cms-block-grid-base.scss';

const columnLayouts = {
    'grid-12': [
        { index: 1, class: 'col-12', label: '100%' },
    ],
    'grid-md-6-6': [
        { index: 1, class: 'col-12 col-md-6', label: '50%' },
        { index: 2, class: 'col-12 col-md-6', label: '50%' },
    ],
    'grid-md-4-8': [
        { index: 1, class: 'col-12 col-md-4', label: '33%' },
        { index: 2, class: 'col-12 col-md-8', label: '67%' },
    ],
    'grid-md-8-4': [
        { index: 1, class: 'col-12 col-md-8', label: '67%' },
        { index: 2, class: 'col-12 col-md-4', label: '33%' },
    ],
    'grid-md-3-9': [
        { index: 1, class: 'col-12 col-md-3', label: '25%' },
        { index: 2, class: 'col-12 col-md-9', label: '75%' },
    ],
    'grid-md-9-3': [
        { index: 1, class: 'col-12 col-md-9', label: '75%' },
        { index: 2, class: 'col-12 col-md-3', label: '25%' },
    ],
    'grid-md-4-4-4': [
        { index: 1, class: 'col-12 col-md-4', label: '33%' },
        { index: 2, class: 'col-12 col-md-4', label: '33%' },
        { index: 3, class: 'col-12 col-md-4', label: '33%' },
    ],
    'grid-md-3-6-3': [
        { index: 1, class: 'col-12 col-md-3', label: '25%' },
        { index: 2, class: 'col-12 col-md-6', label: '50%' },
        { index: 3, class: 'col-12 col-md-3', label: '25%' },
    ],
    'grid-md-2-8-2': [
        { index: 1, class: 'col-12 col-md-2', label: '17%' },
        { index: 2, class: 'col-12 col-md-8', label: '66%' },
        { index: 3, class: 'col-12 col-md-2', label: '17%' },
    ],
    'grid-md-3-3-3-3': [
        { index: 1, class: 'col-12 col-md-3', label: '25%' },
        { index: 2, class: 'col-12 col-md-3', label: '25%' },
        { index: 3, class: 'col-12 col-md-3', label: '25%' },
        { index: 4, class: 'col-12 col-md-3', label: '25%' },
    ],
    'grid-md-2-2-2-2-2-2': [
        { index: 1, class: 'col-12 col-md-2', label: '17%' },
        { index: 2, class: 'col-12 col-md-2', label: '17%' },
        { index: 3, class: 'col-12 col-md-2', label: '17%' },
        { index: 4, class: 'col-12 col-md-2', label: '17%' },
        { index: 5, class: 'col-12 col-md-2', label: '17%' },
        { index: 6, class: 'col-12 col-md-2', label: '17%' },
    ],
};

export default {
    template,

    inject: ['repositoryFactory'],

    props: {
        block: {
            type: Object,
            required: true,
        },
    },

    computed: {
        slotRepository() {
            return this.repositoryFactory.create('cms_slot');
        },

        isActive() {
            return true;
        },

        columnDefinitions() {
            return columnLayouts[this.block?.type] || [{ index: 1, class: 'col-12', label: '100%' }];
        },

        selectedColumnIndex() {
            return this.block?.customFields?.uct_selected_column || 1;
        },
    },

    methods: {
        onSelectColumn(colIndex) {
            const customFields = Shopware.Utils.object.cloneDeep(this.block.customFields || {});
            customFields.uct_selected_column = colIndex;
            this.block.customFields = customFields;

            // Also set this block as active in cmsPage store so sidebar opens block settings
            const cmsPageStore = Shopware.Store.get('cmsPage');
            if (cmsPageStore && typeof cmsPageStore.setBlock === 'function') {
                cmsPageStore.setBlock(this.block);
            }
        },

        getColumnConfig(colIndex) {
            return this.block?.customFields?.uct_columns?.['col' + colIndex] || {};
        },

        getColumnStyles(colIndex) {
            const config = this.getColumnConfig(colIndex);
            const styles = {};

            if (config.padding) {
                styles.padding = config.padding;
            }

            if (config.backgroundColor) {
                styles.backgroundColor = config.backgroundColor;
            }

            if (config.backgroundMediaUrl) {
                styles.backgroundImage = `url("${config.backgroundMediaUrl}")`;
                styles.backgroundSize = config.backgroundMediaMode || 'cover';
                styles.backgroundPosition = 'center';
                styles.backgroundRepeat = 'no-repeat';
            }

            return styles;
        },

        getColumnCustomClass(colIndex) {
            return this.getColumnConfig(colIndex).cssClass || '';
        },

        getColumnSlots(colIndex) {
            if (!this.block?.slots) {
                return [];
            }

            const slotsArray = Array.from(this.block.slots);
            const colSlots = slotsArray.filter((s) => {
                if (colIndex === 1) {
                    return (
                        s.slot === 'content' ||
                        s.slot === 'content1' ||
                        s.slot.startsWith('content1_') ||
                        s.slot.startsWith('content_')
                    );
                }
                const prefix = 'content' + colIndex;
                return s.slot === prefix || s.slot.startsWith(prefix + '_');
            });

            const config = this.getColumnConfig(colIndex);
            const slotOrder = config.slot_order || [];

            if (slotOrder.length > 0) {
                colSlots.sort((a, b) => {
                    const indexA = slotOrder.indexOf(a.slot);
                    const indexB = slotOrder.indexOf(b.slot);
                    if (indexA === -1 && indexB === -1) return 0;
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                });
            }

            return colSlots;
        },

        addSlotToColumn(colIndex) {
            const slotName =
                (this.block.type === 'grid-12' && colIndex === 1 ? 'content_' : 'content' + colIndex + '_') +
                Shopware.Utils.createId();

            const newSlot = this.slotRepository.create();
            newSlot.id = Shopware.Utils.createId();
            newSlot.blockId = this.block.id;
            newSlot.slot = slotName;
            newSlot.type = 'text';
            newSlot.config = {
                content: {
                    source: 'static',
                    value: `
                        <h2>Lorem Ipsum dolor sit amet</h2>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
                        Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    `.trim(),
                },
                verticalAlign: {
                    source: 'static',
                    value: null,
                },
            };
            newSlot.data = {};
            newSlot._isDirty = true;

            if (typeof this.block.slots.add === 'function') {
                this.block.slots.add(newSlot);
            } else {
                this.block.slots.push(newSlot);
            }

            if ('_isDirty' in this.block) {
                this.block._isDirty = true;
            }

            this.updateColumnSlotOrder(colIndex);
        },

        moveSlot(colIndex, slotIndex, direction) {
            const currentSlots = this.getColumnSlots(colIndex);
            const targetIndex = slotIndex + direction;

            if (targetIndex < 0 || targetIndex >= currentSlots.length) {
                return;
            }

            const slotA = currentSlots[slotIndex];
            const slotB = currentSlots[targetIndex];

            currentSlots[slotIndex] = slotB;
            currentSlots[targetIndex] = slotA;

            const newOrder = currentSlots.map((s) => s.slot);
            this.setColumnSlotOrder(colIndex, newOrder);
        },

        removeSlot(colIndex, slotItem) {
            if (typeof this.block.slots.remove === 'function') {
                this.block.slots.remove(slotItem.id);
            } else {
                const idx = this.block.slots.findIndex((s) => s.id === slotItem.id);
                if (idx > -1) {
                    this.block.slots.splice(idx, 1);
                }
            }

            if ('_isDirty' in this.block) {
                this.block._isDirty = true;
            }

            const currentSlots = this.getColumnSlots(colIndex);
            const newOrder = currentSlots.filter((s) => s.id !== slotItem.id).map((s) => s.slot);
            this.setColumnSlotOrder(colIndex, newOrder);
        },

        setColumnSlotOrder(colIndex, order) {
            const customFields = Shopware.Utils.object.cloneDeep(this.block.customFields || {});
            if (!customFields.uct_columns || typeof customFields.uct_columns !== 'object' || Array.isArray(customFields.uct_columns)) {
                customFields.uct_columns = {};
            }
            const key = 'col' + colIndex;
            if (!customFields.uct_columns[key] || typeof customFields.uct_columns[key] !== 'object' || Array.isArray(customFields.uct_columns[key])) {
                customFields.uct_columns[key] = {};
            }

            customFields.uct_columns[key].slot_order = order;
            this.block.customFields = customFields;
            if ('_isDirty' in this.block) {
                this.block._isDirty = true;
            }
        },

        updateColumnSlotOrder(colIndex) {
            const currentSlots = this.getColumnSlots(colIndex);
            this.setColumnSlotOrder(colIndex, currentSlots.map((s) => s.slot));
        },
    },
};

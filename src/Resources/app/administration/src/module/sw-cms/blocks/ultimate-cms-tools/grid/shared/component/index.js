import template from './sw-cms-block-grid-base.html.twig';
import './sw-cms-block-grid-base.scss';

const columnLayouts = {
    'grid-12': [
        { index: 1, class: 'col-12' },
    ],
    'grid-md-6-6': [
        { index: 1, class: 'col-12 col-md-6' },
        { index: 2, class: 'col-12 col-md-6' },
    ],
    'grid-md-4-8': [
        { index: 1, class: 'col-12 col-md-4' },
        { index: 2, class: 'col-12 col-md-8' },
    ],
    'grid-md-8-4': [
        { index: 1, class: 'col-12 col-md-8' },
        { index: 2, class: 'col-12 col-md-4' },
    ],
    'grid-md-3-9': [
        { index: 1, class: 'col-12 col-md-3' },
        { index: 2, class: 'col-12 col-md-9' },
    ],
    'grid-md-9-3': [
        { index: 1, class: 'col-12 col-md-9' },
        { index: 2, class: 'col-12 col-md-3' },
    ],
    'grid-md-4-4-4': [
        { index: 1, class: 'col-12 col-md-4' },
        { index: 2, class: 'col-12 col-md-4' },
        { index: 3, class: 'col-12 col-md-4' },
    ],
    'grid-md-3-6-3': [
        { index: 1, class: 'col-12 col-md-3' },
        { index: 2, class: 'col-12 col-md-6' },
        { index: 3, class: 'col-12 col-md-3' },
    ],
    'grid-md-2-8-2': [
        { index: 1, class: 'col-12 col-md-2' },
        { index: 2, class: 'col-12 col-md-8' },
        { index: 3, class: 'col-12 col-md-2' },
    ],
    'grid-md-3-3-3-3': [
        { index: 1, class: 'col-12 col-md-3' },
        { index: 2, class: 'col-12 col-md-3' },
        { index: 3, class: 'col-12 col-md-3' },
        { index: 4, class: 'col-12 col-md-3' },
    ],
    'grid-md-2-2-2-2-2-2': [
        { index: 1, class: 'col-12 col-md-2' },
        { index: 2, class: 'col-12 col-md-2' },
        { index: 3, class: 'col-12 col-md-2' },
        { index: 4, class: 'col-12 col-md-2' },
        { index: 5, class: 'col-12 col-md-2' },
        { index: 6, class: 'col-12 col-md-2' },
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
            return columnLayouts[this.block?.type] || [{ index: 1, class: 'col-12' }];
        },
    },

    methods: {
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
            newSlot.config = {};
            newSlot.data = {};

            if (typeof this.block.slots.add === 'function') {
                this.block.slots.add(newSlot);
            } else {
                this.block.slots.push(newSlot);
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
            this.ensureColumnConfig(colIndex).slot_order = newOrder;
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

            const config = this.getColumnConfig(colIndex);
            if (config.slot_order) {
                config.slot_order = config.slot_order.filter((name) => name !== slotItem.slot);
            }
        },

        ensureColumnConfig(colIndex) {
            if (!this.block.customFields) {
                this.block.customFields = {};
            }
            if (!this.block.customFields.uct_columns) {
                this.block.customFields.uct_columns = {};
            }
            const key = 'col' + colIndex;
            if (!this.block.customFields.uct_columns[key]) {
                this.block.customFields.uct_columns[key] = {};
            }
            return this.block.customFields.uct_columns[key];
        },

        updateColumnSlotOrder(colIndex) {
            const currentSlots = this.getColumnSlots(colIndex);
            this.ensureColumnConfig(colIndex).slot_order = currentSlots.map((s) => s.slot);
        },
    },
};


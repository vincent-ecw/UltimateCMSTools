import template from './sw-cms-preview-grid-base.html.twig';
import './preview.scss';
import { getColumns } from '../layouts';

export default {
    template,

    props: {
        block: {
            type: Object,
            required: false,
            default: () => ({}),
        },
        type: {
            type: String,
            required: false,
            default: '',
        },
    },

    computed: {
        previewColumns() {
            const cols = getColumns(this.blockType);
            const gap = 8;
            const available = 212 - gap * (cols.length - 1);
            let x = 14;
            return cols.map(col => {
                const width = available * col.width / 12;
                const result = { ...col, x, previewWidth: width };
                x += width + gap;
                return result;
            });
        },

        blockType() {
            return this.type || this.block?.name || this.block?.type || 'uct-grid-md-6-6';
        },
    },
};


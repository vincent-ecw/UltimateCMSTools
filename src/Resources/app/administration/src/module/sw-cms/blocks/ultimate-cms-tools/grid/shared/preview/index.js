import template from './sw-cms-preview-grid-base.html.twig';
import './preview.scss';

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
        blockType() {
            return this.type || this.block?.name || this.block?.type || 'grid-md-6-6';
        },
    },
};


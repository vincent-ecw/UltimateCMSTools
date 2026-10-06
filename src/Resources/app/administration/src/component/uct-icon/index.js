import { iconMarkup } from '../../shared/uct-icons';
import './uct-icon.scss';

Shopware.Component.register('uct-icon', {
    template: '<span v-if="markup" class="uct-icon" :style="{ width: size, height: size }" aria-hidden="true" v-html="markup"></span>',
    props: {
        name: { type: String, default: '' },
        size: { type: String, default: '24px' },
    },
    computed: {
        markup() { return iconMarkup(this.name); },
    },
});

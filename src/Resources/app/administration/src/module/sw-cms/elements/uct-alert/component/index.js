import template from './sw-cms-el-uct-alert.html.twig';
import '../../../../../../../shared/scss/uct-alert.scss';

Shopware.Component.register('sw-cms-el-uct-alert', {
    template,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        alertType() {
            const type = this.element.config.type.value;
            return ['success', 'warning', 'error', 'info'].includes(type) ? type : 'info';
        },
    },
    created() {
        this.initElementConfig('uct-alert');
    },
});

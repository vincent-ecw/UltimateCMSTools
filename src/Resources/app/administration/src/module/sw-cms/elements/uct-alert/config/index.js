import template from './sw-cms-el-config-uct-alert.html.twig';

Shopware.Component.register('sw-cms-el-config-uct-alert', {
    template,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        showIcon: {
            get() { return this.element.config.showIcon?.value ?? false; },
            set(value) {
                this.element.config.showIcon = { source: 'static', value };
                this.onChange();
            },
        },
        messageButtons() {
            return [
                { type: 'bold', title: this.$tc('sw-text-editor-toolbar.title.bold'), icon: 'regular-bold-xs', tag: 'b' },
                { type: 'italic', title: this.$tc('sw-text-editor-toolbar.title.italic'), icon: 'regular-italic-xs', tag: 'i' },
                { type: 'link', title: this.$tc('sw-text-editor-toolbar.title.link'), icon: 'regular-link-xs', tag: 'a', expanded: false, newTab: false, displayAsButton: false, value: '' },
            ];
        },
        message: {
            get() { return this.element.config.message.value; },
            set(value) {
                this.element.config.message.value = value;
                this.onChange();
            },
        },
        type: {
            get() { return this.element.config.type.value; },
            set(value) {
                this.element.config.type.value = value;
                this.onChange();
            },
        },
        dismissible: {
            get() { return this.element.config.dismissible.value; },
            set(value) {
                this.element.config.dismissible.value = value;
                this.onChange();
            },
        },
        typeOptions() {
            return ['success', 'warning', 'error', 'info'].map(value => ({
                value,
                label: this.$tc('sw-cms.elements.ultimateCmsTools.alert.types.' + value),
            }));
        },
    },
    created() {
        this.initElementConfig('uct-alert');
    },
    methods: {
        onChange() {
            this.$emit('element-update', this.element);
        },
    },
});

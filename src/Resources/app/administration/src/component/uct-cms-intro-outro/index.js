import template from './uct-cms-intro-outro.html.twig';

Shopware.Mixin.register('uct-intro-outro', {
    computed: {
        uctIntroText: {
            get() { return this.element?.config?.uctIntroText?.value || ''; },
            set(value) { this.uctSetSurroundingText('uctIntroText', value); },
        },
        uctOutroText: {
            get() { return this.element?.config?.uctOutroText?.value || ''; },
            set(value) { this.uctSetSurroundingText('uctOutroText', value); },
        },
    },
    methods: {
        uctSetSurroundingText(field, value) {
            this.element.config[field] = { source: 'static', value: value || '' };
            this.onChange();
        },
        onChange() { this.$emit('element-update', this.element); },
    },
});

Shopware.Component.register('uct-cms-intro-outro', {
    template,
    props: {
        intro: { type: String, default: '' },
        outro: { type: String, default: '' },
    },
    emits: ['update:intro', 'update:outro'],
});

import template from './sw-cms-el-config-uct-single-product.html.twig';

Shopware.Component.register('sw-cms-el-config-uct-single-product', {
    template,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        badge2DarkText: {
            get() { return this.element.config.badge2DarkText.value; },
            set(value) {
                this.element.config.badge2DarkText.value = value;
                this.onChange();
            },
        },
        badge1DarkText: {
            get() { return this.element.config.badge1DarkText.value; },
            set(value) {
                this.element.config.badge1DarkText.value = value;
                this.onChange();
            },
        },
        badge1Text: { get() { return this.element.config.badge1Text.value; }, set(value) { this.element.config.badge1Text.value = value; this.onChange(); } },
        badge1Color: { get() { return this.element.config.badge1Color.value; }, set(value) { this.element.config.badge1Color.value = value; this.onChange(); } },
        badge2Text: { get() { return this.element.config.badge2Text.value; }, set(value) { this.element.config.badge2Text.value = value; this.onChange(); } },
        badge2Color: { get() { return this.element.config.badge2Color.value; }, set(value) { this.element.config.badge2Color.value = value; this.onChange(); } },
        badgeColorOptions() { return ['primary', 'secondary', 'tertiary'].map(value => ({ value, label: this.$tc('sw-cms.elements.ultimateCmsTools.singleProduct.pillColors.' + value) })); },

        productId: {
            get() { return this.element.config.product.value; },
            set(value) {
                this.element.config.product.value = value;
                this.onChange();
            },
        },
        showVariants: {
            get() { return this.element.config.showVariants.value; },
            set(value) {
                this.element.config.showVariants.value = value;
                this.onChange();
            },
        },
        productCriteria() {
            const criteria = new Shopware.Data.Criteria(1, 25);
            criteria.addAssociation('options.group');
            return criteria;
        },
        productContext() { return { ...Shopware.Context.api, inheritance: true }; },
    },
    created() { this.initElementConfig('uct-single-product'); },
    methods: {
        onChange() { this.$emit('element-update', this.element); },
    },
});

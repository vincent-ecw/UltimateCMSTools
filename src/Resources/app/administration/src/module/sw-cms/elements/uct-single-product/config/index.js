import template from './sw-cms-el-config-uct-single-product.html.twig';

Shopware.Component.register('sw-cms-el-config-uct-single-product', {
    template,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
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

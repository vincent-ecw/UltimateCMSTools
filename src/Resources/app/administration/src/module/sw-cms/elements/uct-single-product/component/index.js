import template from './sw-cms-el-uct-single-product.html.twig';

Shopware.Component.register('sw-cms-el-uct-single-product', {
    template,
    inject: ['repositoryFactory'],
    mixins: [Shopware.Mixin.getByName('cms-element')],
    watch: {
        'element.config.product.value': { handler: 'loadProduct' },
    },
    created() {
        this.initElementConfig('uct-single-product');
        this.loadProduct();
    },
    methods: {
        async loadProduct() {
            const id = this.element.config.product.value;
            if (!this.element.data) this.element.data = {};
            this.element.data.product = null;
            if (!id) return;
            const criteria = new Shopware.Data.Criteria(1, 1);
            criteria.addAssociation('cover.media');
            criteria.addAssociation('options.group');
            try {
                const product = await this.repositoryFactory.create('product').get(id, { ...Shopware.Context.api, inheritance: true }, criteria);
                if (id === this.element.config.product.value) this.element.data.product = product;
            } catch {
                // Keep Shopware's placeholder for deleted or inaccessible products.
            }
        },
    },
});

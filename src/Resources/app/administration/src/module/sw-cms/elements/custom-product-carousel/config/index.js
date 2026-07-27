import template from './sw-cms-el-config-custom-product-carousel.html.twig';
import './sw-cms-el-config-custom-product-carousel.scss';

const { Component, Mixin } = Shopware;
const { Criteria, EntityCollection } = Shopware.Data;

Component.register('sw-cms-el-config-custom-product-carousel', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    data() {
        return {
            productCollection: null,
            activeTab: 'content'
        };
    },

    computed: {
        productRepository() {
            return this.repositoryFactory.create('product');
        },

        productStreamRepository() {
            return this.repositoryFactory.create('product_stream');
        },

        productMultiSelectContext() {
            const context = { ...Shopware.Context.api };
            context.inheritance = true;
            return context;
        },

        productMediaFilter() {
            const criteria = new Criteria(1, 25);
            criteria.addAssociation('cover');
            return criteria;
        },

        // Computed properties with getters/setters for reactivity as per rules
        productSelectionType: {
            get() {
                return this.element?.config?.productSelectionType?.value || 'manual';
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.productSelectionType) {
                    this.element.config.productSelectionType = { source: 'static', value: 'manual' };
                }
                this.element.config.productSelectionType.value = value;
                this.onChange();
            }
        },

        productStreamId: {
            get() {
                return this.element?.config?.productStreamId?.value || null;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.productStreamId) {
                    this.element.config.productStreamId = { source: 'static', value: null };
                }
                this.element.config.productStreamId.value = value;
                this.onChange();
            }
        },

        categoryId: {
            get() {
                return this.element?.config?.categoryId?.value || null;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.categoryId) {
                    this.element.config.categoryId = { source: 'static', value: null };
                }
                this.element.config.categoryId.value = value;
                this.onChange();
            }
        },

        includeSubcategories: {
            get() {
                return this.element?.config?.includeSubcategories?.value ?? false;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.includeSubcategories) {
                    this.element.config.includeSubcategories = { source: 'static', value: false };
                }
                this.element.config.includeSubcategories.value = value;
                this.onChange();
            }
        },

        limit: {
            get() {
                return this.element?.config?.limit?.value || 10;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.limit) {
                    this.element.config.limit = { source: 'static', value: 10 };
                }
                this.element.config.limit.value = value;
                this.onChange();
            }
        },

        navigationArrows: {
            get() {
                return this.element?.config?.navigationArrows?.value;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.navigationArrows) {
                    this.element.config.navigationArrows = { source: 'static', value: true };
                }
                this.element.config.navigationArrows.value = value;
                this.onChange();
            }
        },

        navigationDots: {
            get() {
                return this.element?.config?.navigationDots?.value;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.navigationDots) {
                    this.element.config.navigationDots = { source: 'static', value: true };
                }
                this.element.config.navigationDots.value = value;
                this.onChange();
            }
        },

        navigationDotsPosition: {
            get() {
                return this.element?.config?.navigationDotsPosition?.value || 'inside';
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.navigationDotsPosition) {
                    this.element.config.navigationDotsPosition = { source: 'static', value: 'inside' };
                }
                this.element.config.navigationDotsPosition.value = value;
                this.onChange();
            }
        },

        autoplay: {
            get() {
                return this.element?.config?.autoplay?.value ?? true;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.autoplay) {
                    this.element.config.autoplay = { source: 'static', value: true };
                }
                this.element.config.autoplay.value = value;
                this.onChange();
            }
        },

        autoplaySpeed: {
            get() {
                return this.element?.config?.autoplaySpeed?.value || 5000;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.autoplaySpeed) {
                    this.element.config.autoplaySpeed = { source: 'static', value: 5000 };
                }
                this.element.config.autoplaySpeed.value = value;
                this.onChange();
            }
        },

        maxHeight: {
            get() {
                return this.element?.config?.maxHeight?.value || null;
            },
            set(value) {
                if (!this.element.config) {
                    this.element.config = {};
                }
                if (!this.element.config.maxHeight) {
                    this.element.config.maxHeight = { source: 'static', value: null };
                }
                this.element.config.maxHeight.value = value;
                this.onChange();
            }
        },

        productSelectionTypeOptions() {
            return [
                { value: 'manual', label: this.$tc('sw-cms.elements.customProductCarousel.config.selectionTypes.manual') },
                { value: 'product_stream', label: this.$tc('sw-cms.elements.customProductCarousel.config.selectionTypes.productStream') },
                { value: 'latest', label: this.$tc('sw-cms.elements.customProductCarousel.config.selectionTypes.latest') },
                { value: 'sale', label: this.$tc('sw-cms.elements.customProductCarousel.config.selectionTypes.sale') }
            ];
        },

        dotsPositionOptions() {
            return [
                { value: 'inside', label: this.$tc('sw-cms.elements.customProductCarousel.config.dotsPositions.inside') },
                { value: 'outside', label: this.$tc('sw-cms.elements.customProductCarousel.config.dotsPositions.outside') }
            ];
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('custom-product-carousel');

            this.productCollection = new EntityCollection('/product', 'product', Shopware.Context.api);

            if (this.element.config.products && this.element.config.products.value && this.element.config.products.value.length > 0) {
                this.loadManualAssignment();
            }
        },

        async loadManualAssignment() {
            const criteria = new Criteria(1, 100);
            criteria.addAssociation('cover');
            criteria.setIds(this.element.config.products.value);

            this.productCollection = await this.productRepository.search(criteria, {
                ...Shopware.Context.api,
                inheritance: true
            });
        },

        onProductsChange() {
            this.element.config.products.value = this.productCollection.getIds();
            
            if (!this.element.data) {
                this.element.data = {};
            }
            this.element.data.products = this.productCollection;
            
            this.onChange();
        },

        isSelected(itemId) {
            return this.productCollection ? this.productCollection.has(itemId) : false;
        },

        onChange() {
            this.$emit('element-update', this.element);
        }
    }
});

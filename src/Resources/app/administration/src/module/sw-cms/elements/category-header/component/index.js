import template from './sw-cms-el-category-header.html.twig';
import './sw-cms-el-category-header.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-category-header', {
    template,

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    computed: {
        category() {
            return this.element?.data?.category || null;
        },

        design() {
            return this.element?.config?.design?.value || 'design-1';
        },

        title() {
            const override = this.element?.config?.title?.value;
            if (override && override.trim() !== '') {
                return override;
            }
            if (this.category?.customFields?.ultimate_cms_tools_page_title) {
                return this.category.customFields.ultimate_cms_tools_page_title;
            }
            if (this.category?.translated?.name || this.category?.name) {
                return this.category.translated?.name || this.category.name;
            }
            return 'Category Title';
        },

        subtitle() {
            const override = this.element?.config?.subtitle?.value;
            if (override && override.trim() !== '') {
                return override;
            }
            if (this.category?.customFields?.ultimate_cms_tools_subtitle) {
                return this.category.customFields.ultimate_cms_tools_subtitle;
            }
            return 'Category Subtitle';
        },

        description() {
            const override = this.element?.config?.description?.value;
            if (override && override.trim() !== '') {
                return override;
            }
            if (this.category?.translated?.description || this.category?.description) {
                return this.category.translated?.description || this.category.description;
            }
            return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.';
        },

        media() {
            return this.element?.data?.media || this.category?.media || null;
        },

        mediaUrl() {
            if (this.media?.url) {
                return this.media.url;
            }
            if (typeof this.assetFilter === 'function') {
                return this.assetFilter('/administration/administration/static/img/cms/preview_mountain_large.webp');
            }
            const assetFilter = Shopware.Filter.getByName('asset');
            if (assetFilter) {
                return assetFilter('/administration/administration/static/img/cms/preview_mountain_large.webp');
            }
            return '/bundles/administration/administration/static/img/cms/preview_mountain_large.webp';
        },

        designClass() {
            const design = this.design || 'design-1';
            return design.startsWith('design-') ? design : `design-${design}`;
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('category-header');
        },
    },
});

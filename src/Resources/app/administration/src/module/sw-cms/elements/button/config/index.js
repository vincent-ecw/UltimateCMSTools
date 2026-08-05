import template from './sw-cms-el-config-button.html.twig';
import './sw-cms-el-config-button.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-button', {
    template,

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    computed: {
        title: {
            get() {
                return this.element?.config?.title?.value || '';
            },
            set(value) {
                this.element.config.title.value = value;
                this.onChange();
            },
        },

        variant: {
            get() {
                return this.element?.config?.variant?.value || 'primary';
            },
            set(value) {
                this.element.config.variant.value = value;
                this.onChange();
            },
        },

        width: {
            get() {
                return this.element?.config?.width?.value || 'auto';
            },
            set(value) {
                this.element.config.width.value = value;
                this.onChange();
            },
        },

        alignment: {
            get() {
                return this.element?.config?.alignment?.value || 'left';
            },
            set(value) {
                this.element.config.alignment.value = value;
                this.onChange();
            },
        },

        linkUrl: {
            get() {
                return this.element?.config?.linkUrl?.value || '';
            },
            set(value) {
                this.element.config.linkUrl.value = value;
                this.onChange();
            },
        },

        linkTarget: {
            get() {
                return this.element?.config?.linkTarget?.value || '_self';
            },
            set(value) {
                this.element.config.linkTarget.value = value;
                this.onChange();
            },
        },

        linkTitle: {
            get() {
                return this.element?.config?.linkTitle?.value || '';
            },
            set(value) {
                this.element.config.linkTitle.value = value;
                this.onChange();
            },
        },

        iconBefore: {
            get() {
                return this.element?.config?.iconBefore?.value || 'none';
            },
            set(value) {
                this.element.config.iconBefore.value = value;
                this.onChange();
            },
        },

        iconAfter: {
            get() {
                return this.element?.config?.iconAfter?.value || 'none';
            },
            set(value) {
                this.element.config.iconAfter.value = value;
                this.onChange();
            },
        },

        variantOptions() {
            return [
                { value: 'primary', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.variants.primary') },
                { value: 'secondary', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.variants.secondary') },
                { value: 'outline-primary', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.variants.outlinePrimary') },
                { value: 'outline-secondary', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.variants.outlineSecondary') },
                { value: 'link', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.variants.link') },
            ];
        },

        widthOptions() {
            return [
                { value: 'auto', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.widths.auto') },
                { value: 'full', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.widths.full') },
            ];
        },

        alignmentOptions() {
            return [
                { value: 'left', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.alignments.left') },
                { value: 'center', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.alignments.center') },
                { value: 'right', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.alignments.right') },
            ];
        },

        targetOptions() {
            return [
                { value: '_self', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.targets.self') },
                { value: '_blank', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.targets.blank') },
            ];
        },

        iconOptions() {
            return [
                { value: 'none', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.icons.none') },
                // Arrows & Navigation
                { value: 'regular-arrow-right', label: 'Arrow Right' },
                { value: 'regular-arrow-left', label: 'Arrow Left' },
                { value: 'regular-arrow-up', label: 'Arrow Up' },
                { value: 'regular-arrow-down', label: 'Arrow Down' },
                { value: 'regular-chevron-right', label: 'Chevron Right' },
                { value: 'regular-chevron-left', label: 'Chevron Left' },
                { value: 'regular-chevron-up', label: 'Chevron Up' },
                { value: 'regular-chevron-down', label: 'Chevron Down' },
                { value: 'regular-external-link', label: 'External Link' },
                // Contact & Communication
                { value: 'regular-phone', label: 'Phone / Contact' },
                { value: 'regular-envelope', label: 'Mail / Email' },
                { value: 'regular-paper-plane', label: 'Send / Paper Plane' },
                { value: 'regular-comments', label: 'Comments / Chat' },
                { value: 'regular-headset', label: 'Support / Headset' },
                // Actions & Tasks
                { value: 'regular-download', label: 'Download' },
                { value: 'regular-checkmark', label: 'Checkmark / Success' },
                { value: 'regular-plus', label: 'Plus / Add' },
                { value: 'regular-search', label: 'Search' },
                { value: 'regular-trash', label: 'Trash / Delete' },
                { value: 'regular-cog', label: 'Settings / Gear' },
                { value: 'regular-filter', label: 'Filter' },
                { value: 'regular-info-circle', label: 'Info' },
                { value: 'regular-question-circle', label: 'Help / FAQ' },
                // User & Security
                { value: 'regular-user', label: 'User / Profile' },
                { value: 'regular-users', label: 'Users / Team' },
                { value: 'regular-lock', label: 'Lock / Security' },
                { value: 'regular-lock-open', label: 'Unlock' },
                { value: 'regular-key', label: 'Key / Login' },
                // Favorites & Ratings
                { value: 'regular-heart', label: 'Heart / Favorite' },
                { value: 'regular-thumb-up', label: 'Like / Thumbs Up' },
                { value: 'regular-star', label: 'Star / Rating' },
                { value: 'regular-trophy', label: 'Trophy / Award' },
                // Commerce & Shop
                { value: 'regular-shopping-bag', label: 'Shopping Bag' },
                { value: 'regular-shopping-cart', label: 'Shopping Cart' },
                { value: 'regular-shop', label: 'Store / Shop' },
                { value: 'regular-products', label: 'Products' },
                { value: 'regular-credit-card', label: 'Credit Card / Payment' },
            ];
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('button');
        },

        onChange() {
            this.$emit('element-update', this.element);
        },
    },
});

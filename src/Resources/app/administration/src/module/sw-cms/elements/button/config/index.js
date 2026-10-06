import { iconOptions as bundledIconOptions } from '../../../../../shared/uct-icons';
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

        verticalAlignment: {
            get() {
                return this.element?.config?.verticalAlignment?.value || 'top';
            },
            set(value) {
                this.element.config.verticalAlignment.value = value;
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

        verticalAlignmentOptions() {
            return [
                { value: 'top', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.verticalAlignments.top') },
                { value: 'center', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.verticalAlignments.center') },
                { value: 'bottom', label: this.$tc('sw-cms.elements.ultimateCmsTools.button.config.verticalAlignments.bottom') },
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
                ...bundledIconOptions,
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

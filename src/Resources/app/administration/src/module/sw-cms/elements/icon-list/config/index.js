import { iconOptions as bundledIconOptions } from '../../../../../shared/uct-icons';
import template from './sw-cms-el-config-icon-list.html.twig';
import './sw-cms-el-config-icon-list.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-icon-list', {
    template,

    mixins: [
        Shopware.Mixin.getByName('uct-intro-outro'),
        Mixin.getByName('cms-element'),
    ],

    data() {
        return {
            activeTab: 'content',
        };
    },

    computed: {
        layout: {
            get() {
                return this.element?.config?.layout?.value || 'horizontal';
            },
            set(value) {
                this.element.config.layout.value = value;
                this.onChange();
            },
        },

        animation: {
            get() {
                return this.element?.config?.animation?.value || 'none';
            },
            set(value) {
                this.element.config.animation.value = value;
                this.onChange();
            },
        },

        items() {
            return this.element?.config?.items?.value || [];
        },

        layoutOptions() {
            return [
                { value: 'horizontal', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.layouts.horizontal') },
                { value: 'vertical', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.layouts.vertical') },
            ];
        },

        animationOptions() {
            return [
                { value: 'none', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.animations.none') },
                { value: 'fade', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.animations.fade') },
                { value: 'slide-right', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.animations.slideRight') },
                { value: 'slide-left', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.animations.slideLeft') },
            ];
        },

        targetOptions() {
            return [
                { value: '_self', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.targets.self') },
                { value: '_blank', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.targets.blank') },
            ];
        },

        iconOptions() {
            return [
                { value: 'none', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.icons.none') },
                { value: 'custom', label: this.$tc('sw-cms.elements.ultimateCmsTools.iconList.config.icons.custom') },
                ...bundledIconOptions,
            ];
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('icon-list');
        },

        onAddItem() {
            if (!Array.isArray(this.element.config.items.value)) {
                this.element.config.items.value = [];
            }
            this.element.config.items.value.push({
                icon: 'regular-rocket',
                customIconClass: '',
                title: 'New Item',
                text: 'Item description text...',
                url: '',
                target: '_self',
            });
            this.onChange();
        },

        onRemoveItem(index) {
            this.element.config.items.value.splice(index, 1);
            this.onChange();
        },

        onMoveItemUp(index) {
            if (index > 0) {
                const items = [...this.element.config.items.value];
                const temp = items[index];
                items[index] = items[index - 1];
                items[index - 1] = temp;
                this.element.config.items.value = items;
                this.onChange();
            }
        },

        onMoveItemDown(index) {
            if (index < this.element.config.items.value.length - 1) {
                const items = [...this.element.config.items.value];
                const temp = items[index];
                items[index] = items[index + 1];
                items[index + 1] = temp;
                this.element.config.items.value = items;
                this.onChange();
            }
        },

        onItemChange() {
            this.onChange();
        },

        onChange() {
            this.$emit('element-update', this.element);
        },
    },
});

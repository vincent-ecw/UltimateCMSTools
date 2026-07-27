import template from './sw-cms-el-config-statistics.html.twig';
import './sw-cms-el-config-statistics.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-statistics', {
    template,

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    data() {
        return {
            activeTab: 'content',
        };
    },

    computed: {
        theme: {
            get() {
                return this.element?.config?.theme?.value || 'boxed';
            },
            set(value) {
                this.element.config.theme.value = value;
                this.onChange();
            },
        },

        introText: {
            get() {
                return this.element?.config?.introText?.value || '';
            },
            set(value) {
                this.element.config.introText.value = value;
                this.onChange();
            },
        },

        columns: {
            get() {
                return this.element?.config?.columns?.value || '3';
            },
            set(value) {
                this.element.config.columns.value = value;
                this.onChange();
            },
        },

        items() {
            return this.element?.config?.items?.value || [];
        },

        themeOptions() {
            return [
                { value: 'clean', label: this.$tc('sw-cms.elements.ultimateCmsTools.statistics.config.themes.clean') },
                { value: 'boxed', label: this.$tc('sw-cms.elements.ultimateCmsTools.statistics.config.themes.boxed') },
                { value: 'clean-divided', label: this.$tc('sw-cms.elements.ultimateCmsTools.statistics.config.themes.cleanDivided') },
            ];
        },

        columnOptions() {
            return [
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
            ];
        },

        iconOptions() {
            return [
                { value: 'avatar-multiple', label: 'Users / Team (avatar-multiple)' },
                { value: 'avatar', label: 'User (avatar)' },
                { value: 'money-card', label: 'Credit Card / Payment (money-card)' },
                { value: 'money-cash', label: 'Cash / Money (money-cash)' },
                { value: 'bag', label: 'Shopping Bag (bag)' },
                { value: 'products', label: 'Products (products)' },
                { value: 'shop', label: 'Store / Shop (shop)' },
                { value: 'chart', label: 'Chart (chart)' },
                { value: 'chart-bar', label: 'Bar Chart (chart-bar)' },
                { value: 'star', label: 'Star (star)' },
                { value: 'trophy', label: 'Trophy / Award (trophy)' },
                { value: 'medal', label: 'Medal (medal)' },
                { value: 'checkmark', label: 'Checkmark (checkmark)' },
                { value: 'globe', label: 'Globe (globe)' },
                { value: 'shield', label: 'Shield (shield)' },
                { value: 'clock', label: 'Clock (clock)' },
                { value: 'lightbulb', label: 'Lightbulb (lightbulb)' },
                { value: 'heart', label: 'Heart (heart)' },
                { value: 'speech-bubbles', label: 'Speech / Comments (speech-bubbles)' },
                { value: 'thumb-up', label: 'Thumbs Up (thumb-up)' },
                { value: 'sparkles', label: 'Sparkles (sparkles)' },
                { value: 'rocket', label: 'Rocket (rocket)' },
                { value: 'truck', label: 'Truck (truck)' },
                { value: 'briefcase', label: 'Briefcase (briefcase)' },
                { value: 'marketing', label: 'Marketing (marketing)' },
                { value: 'pulse', label: 'Pulse / Activity (pulse)' },
            ];
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('statistics');
        },

        onAddItem() {
            this.element.config.items.value.push({
                icon: 'star',
                title: 'New Statistic',
                number: '100+',
                subline: 'Description here',
            });
            this.onChange();
        },

        onRemoveItem(index) {
            this.element.config.items.value.splice(index, 1);
            this.onChange();
        },

        onItemChange() {
            this.onChange();
        },

        onChange() {
            this.$emit('element-update', this.element);
        },
    },
});

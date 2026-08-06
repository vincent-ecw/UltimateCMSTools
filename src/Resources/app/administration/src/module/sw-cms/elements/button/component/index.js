import template from './sw-cms-el-button.html.twig';
import './sw-cms-el-button.scss';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-button', {
    template,

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    computed: {
        title() {
            return this.element?.config?.title?.value || 'Click here';
        },

        variant() {
            return this.element?.config?.variant?.value || 'primary';
        },

        width() {
            return this.element?.config?.width?.value || 'auto';
        },

        alignment() {
            return this.element?.config?.alignment?.value || 'left';
        },

        verticalAlignment() {
            return this.element?.config?.verticalAlignment?.value || 'top';
        },

        iconBefore() {
            const icon = this.element?.config?.iconBefore?.value;
            return (icon && icon !== 'none') ? icon : null;
        },

        iconAfter() {
            const icon = this.element?.config?.iconAfter?.value;
            return (icon && icon !== 'none') ? icon : null;
        },

        buttonClasses() {
            return [
                'sw-cms-el-button__btn',
                `sw-cms-el-button__btn--${this.variant}`,
                {
                    'is-full-width': this.width === 'full' || this.width === '100%',
                },
            ];
        },

        containerClasses() {
            return [
                'sw-cms-el-button',
                `sw-cms-el-button--align-${this.alignment}`,
                `sw-cms-el-button--vertical-align-${this.verticalAlignment}`,
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
    },
});

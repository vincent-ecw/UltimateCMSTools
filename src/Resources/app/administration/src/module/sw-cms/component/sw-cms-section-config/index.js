import template from './sw-cms-section-config.html.twig';

const { Component } = Shopware;

Component.override('sw-cms-section-config', {
    template,

    computed: {
        uctHideWhenEmpty: {
            get() {
                return this.section?.customFields?.uct_hide_empty ?? false;
            },
            set(value) {
                if (!this.section.customFields) {
                    this.section.customFields = {};
                }
                this.section.customFields.uct_hide_empty = value;
            }
        },

        uctCustomerGroupId: {
            get() {
                return this.section?.customFields?.uct_customer_group_id || null;
            },
            set(value) {
                if (!this.section.customFields) {
                    this.section.customFields = {};
                }
                this.section.customFields.uct_customer_group_id = value || null;
            }
        }
    }
});

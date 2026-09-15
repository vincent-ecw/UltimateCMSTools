import template from './sw-cms-section-config.html.twig';

const { Component } = Shopware;

Component.override('sw-cms-section-config', {
    template,

    computed: {
        uctLoginStatus: {
            get() {
                return this.section?.customFields?.uct_login_status
                    || (this.uctCustomerGroupId ? 'logged-in' : 'all');
            },
            set(value) {
                if (!this.section.customFields) {
                    this.section.customFields = {};
                }
                this.section.customFields.uct_login_status = value || 'all';
                if (value !== 'logged-in') {
                    this.section.customFields.uct_customer_group_id = null;
                }
            }
        },

        uctLoginStatusOptions() {
            return ['all', 'logged-in', 'logged-out'].map(value => ({
                value,
                label: this.$tc('sw-cms.section.loginStatus.options.' + value),
            }));
        },

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

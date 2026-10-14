import template from './sw-cms-sidebar.html.twig';
import layouts from '../../../../../../shared/grid-layouts.json';

const gridBlockTypes = Object.keys(layouts);

Shopware.Component.override('sw-cms-sidebar', {
    template,
    inject: ['uctGridBuilderSettingsApiService'],

    data() {
        return { uctGridBuilderEnabled: false };
    },

    computed: {
        cmsBlockCategories() {
            const categories = this.$super('cmsBlockCategories');
            if (this.uctGridBuilderEnabled || Object.values(this.cmsBlocks).some(block => block.category === 'page-structure')) {
                return categories;
            }
            return categories.filter(category => category.value !== 'page-structure');
        },

        cmsBlocks() {
            const blocks = this.$super('cmsBlocks');
            if (this.uctGridBuilderEnabled) {
                return blocks;
            }
            return Object.fromEntries(Object.entries(blocks).filter(([name]) => !gridBlockTypes.includes(name)));
        },
    },

    methods: {
        async createdComponent() {
            this.$super('createdComponent');
            // CMS layouts may be shared by sales channels: read the global value.
            try {
                const values = await this.uctGridBuilderSettingsApiService.getSettings();
                this.uctGridBuilderEnabled = values.enabled === true;
            } catch {
                // Fail closed for new choices; saved grids remain registered.
                this.uctGridBuilderEnabled = false;
            }
        },

        uctIsGridBlock(block) {
            return !!(block && gridBlockTypes.includes(block.type));
        },
    },
});

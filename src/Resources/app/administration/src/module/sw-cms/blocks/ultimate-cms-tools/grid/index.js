import baseComponent from './shared/component';
import basePreview from './shared/preview';
import './shared/config';

const gridBlocks = [
    {
        name: 'grid-12',
        label: 'sw-cms.blocks.ultimateCmsTools.grid12.label',
        slots: {
            content: 'text',
        },
    },
    {
        name: 'grid-md-6-6',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd66.label',
        slots: {
            content1: 'text',
            content2: 'text',
        },
    },
    {
        name: 'grid-md-4-8',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd48.label',
        slots: {
            content1: 'text',
            content2: 'text',
        },
    },
    {
        name: 'grid-md-8-4',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd84.label',
        slots: {
            content1: 'text',
            content2: 'text',
        },
    },
    {
        name: 'grid-md-3-9',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd39.label',
        slots: {
            content1: 'text',
            content2: 'text',
        },
    },
    {
        name: 'grid-md-9-3',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd93.label',
        slots: {
            content1: 'text',
            content2: 'text',
        },
    },
    {
        name: 'grid-md-4-4-4',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd444.label',
        slots: {
            content1: 'text',
            content2: 'text',
            content3: 'text',
        },
    },
    {
        name: 'grid-md-3-6-3',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd363.label',
        slots: {
            content1: 'text',
            content2: 'text',
            content3: 'text',
        },
    },
    {
        name: 'grid-md-2-8-2',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd282.label',
        slots: {
            content1: 'text',
            content2: 'text',
            content3: 'text',
        },
    },
    {
        name: 'grid-md-3-3-3-3',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd3333.label',
        slots: {
            content1: 'text',
            content2: 'text',
            content3: 'text',
            content4: 'text',
        },
    },
    {
        name: 'grid-md-2-2-2-2-2-2',
        label: 'sw-cms.blocks.ultimateCmsTools.gridMd222222.label',
        slots: {
            content1: 'text',
            content2: 'text',
            content3: 'text',
            content4: 'text',
            content5: 'text',
            content6: 'text',
        },
    },
];

gridBlocks.forEach((block) => {
    Shopware.Component.register('sw-cms-block-' + block.name, {
        ...baseComponent,
    });

    Shopware.Component.register('sw-cms-preview-' + block.name, {
        ...basePreview,
        computed: {
            blockType() {
                return block.name;
            },
        },
    });

    // Alias for compatibility with previous preview naming
    Shopware.Component.register('sw-cms-block-preview-' + block.name, {
        ...basePreview,
        computed: {
            blockType() {
                return block.name;
            },
        },
    });

    Shopware.Service('cmsService').registerCmsBlock({
        name: block.name,
        label: block.label,
        category: 'page-structure',
        component: 'sw-cms-block-' + block.name,
        previewComponent: 'sw-cms-preview-' + block.name,
        defaultConfig: {
            marginBottom: '20px',
            marginTop: '20px',
            marginLeft: '20px',
            marginRight: '20px',
            sizingMode: 'boxed',
        },
        slots: block.slots,
    });
});

export default gridBlocks;


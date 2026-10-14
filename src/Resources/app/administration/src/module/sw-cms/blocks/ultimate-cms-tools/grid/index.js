import baseComponent from './shared/component';
import basePreview from './shared/preview';
import { layouts, getColumns } from './shared/layouts';
import './shared/config';

const gridBlocks = Object.entries(layouts).map(([name, layout]) => ({
    name,
    label: layout.label,
    slots: Object.fromEntries(getColumns(name).map((col) => [
        name === 'uct-grid-12' ? 'content' : `content${col.index}`, 'text',
    ])),
}));

gridBlocks.forEach((block) => {
    Shopware.Component.register('sw-cms-block-' + block.name, { ...baseComponent });
    for (const prefix of ['sw-cms-preview-', 'sw-cms-block-preview-']) {
        Shopware.Component.register(prefix + block.name, {
            ...basePreview,
            computed: {
                ...basePreview.computed,
                blockType() { return block.name; },
            },
        });
    }
    Shopware.Service('cmsService').registerCmsBlock({
        ...block,
        category: 'page-structure',
        component: 'sw-cms-block-' + block.name,
        previewComponent: 'sw-cms-preview-' + block.name,
        defaultConfig: {
            marginBottom: '20px', marginTop: '20px', marginLeft: '20px', marginRight: '20px',
            sizingMode: 'boxed',
        },
    });
});

export default gridBlocks;

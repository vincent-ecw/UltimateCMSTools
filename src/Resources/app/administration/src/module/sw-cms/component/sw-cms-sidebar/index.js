import template from './sw-cms-sidebar.html.twig';

const gridBlockTypes = [
    'grid-12',
    'grid-md-6-6',
    'grid-md-4-8',
    'grid-md-8-4',
    'grid-md-3-9',
    'grid-md-9-3',
    'grid-md-4-4-4',
    'grid-md-3-6-3',
    'grid-md-2-8-2',
    'grid-md-3-3-3-3',
    'grid-md-2-2-2-2-2-2',
];

Shopware.Component.override('sw-cms-sidebar', {
    template,

    methods: {
        uctIsGridBlock(block) {
            return !!(block && gridBlockTypes.includes(block.type));
        },
    },
});


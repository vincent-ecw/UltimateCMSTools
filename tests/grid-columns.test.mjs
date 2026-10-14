import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../src/Resources/app/administration/src/module/sw-cms/blocks/ultimate-cms-tools/grid/shared/', import.meta.url);
function load(file) {
    let component;
    const context = {
        template: '', getColumns: type => {
            const catalog = JSON.parse(readFileSync(new URL('../src/Resources/app/shared/grid-layouts.json', import.meta.url), 'utf8'));
            return (catalog[type] || catalog['uct-grid-12']).widths.map((width, index) => ({ index: index + 1, width }));
        }, Shopware: {
            Component: { register: (_name, value) => { component = value; } },
            Utils: { object: { cloneDeep: structuredClone } },
        },
    };
    const source = readFileSync(new URL(file, root), 'utf8')
        .replace(/^import .*;$/gm, '')
        .replace('export default {', 'globalThis.component = {');
    vm.runInNewContext(source, context);
    return component || context.component;
}

test('slot ordering ignores malformed data and persists column-local moves', () => {
    const component = load('component/index.js');
    const state = {
        canEdit: true,
        block: { slots: [
            { id: 'a', slot: 'content1' }, { id: 'b', slot: 'content1_extra' },
            { id: 'c', slot: 'content2' },
        ], customFields: { uct_columns: { col1: { slot_order: {} } } } },
        ...component.methods,
    };
    assert.deepEqual(Array.from(state.getColumnSlots(1), s => s.id), ['a', 'b']);
    state.moveSlot(1, 0, 1);
    assert.deepEqual(Array.from(state.getColumnSlots(1), s => s.id), ['b', 'a']);
    assert.deepEqual(Array.from(state.getColumnSlots(2), s => s.id), ['c']);
    state.moveSlot(1, 0, -1);
    assert.deepEqual(Array.from(state.getColumnSlots(1), s => s.id), ['b', 'a']);
});

test('upload retains its target column and does not modify a newly selected block', async () => {
    const component = load('config/index.js');
    let resolve;
    const changes = [];
    const state = {
        block: { id: 'block-a' }, activeColumn: 1, mediaMap: {},
        mediaRepository: { get: () => new Promise(r => { resolve = r; }) },
        setColumnProp: (...args) => changes.push(args),
    };
    const first = component.methods.onUploadMediaFinish.call(state, { targetId: 'media' }, 1);
    state.activeColumn = 2;
    resolve({ id: 'media', url: '/media/image.jpg' });
    await first;
    assert.equal(changes.length, 2);
    assert.equal(changes[0][2], 1);
    changes.length = 0;
    const second = component.methods.onUploadMediaFinish.call(state, { targetId: 'media' }, 2);
    state.block = { id: 'block-b' };
    resolve({ id: 'media', url: '/media/image.jpg' });
    await second;
    assert.equal(changes.length, 0);
});

test('read-only controls cannot mutate slots or column properties', () => {
    const canvas = load('component/index.js');
    const config = load('config/index.js');
    const block = { slots: [{ id: 'a', slot: 'content1' }], customFields: null };
    const state = { canEdit: false, block };
    canvas.methods.addSlotToColumn.call(state, 1);
    canvas.methods.moveSlot.call(state, 1, 0, 1);
    canvas.methods.removeSlot.call(state, 1, block.slots[0]);
    config.methods.setColumnProp.call(state, 'padding', '20px');
    config.methods.initCustomFields.call(state);
    assert.equal(block.slots.length, 1);
    assert.equal(block.customFields, null);
});

test('global setting hides new choices without unregistering saved or legacy blocks', async () => {
    let sidebar;
    const catalog = JSON.parse(readFileSync(new URL('../src/Resources/app/shared/grid-layouts.json', import.meta.url), 'utf8'));
    const source = readFileSync(new URL('../src/Resources/app/administration/src/module/sw-cms/component/sw-cms-sidebar/index.js', import.meta.url), 'utf8').replace(/^import .*;$/gm, '');
    vm.runInNewContext(source, { template: '', layouts: catalog, Shopware: { Component: { override: (_name, value) => { sidebar = value; } } } });
    const registry = { 'grid-md-6-6': { name: 'grid-md-6-6' }, 'uct-grid-md-6-6': { name: 'uct-grid-md-6-6' }, text: { name: 'text' } };
    const state = {
        ...sidebar.data(), $super: name => name === 'cmsBlocks' ? registry : undefined,
        uctGridBuilderSettingsApiService: { getSettings: async () => ({ enabled: false }) },
    };
    await sidebar.methods.createdComponent.call(state);
    assert.deepEqual(Object.keys(sidebar.computed.cmsBlocks.call(state)), ['grid-md-6-6', 'text']);
    assert.ok(registry['uct-grid-md-6-6']);
    assert.equal(sidebar.methods.uctIsGridBlock({ type: 'uct-grid-md-6-6' }), true);
    assert.equal(sidebar.methods.uctIsGridBlock({ type: 'grid-md-6-6' }), false);
    state.uctGridBuilderSettingsApiService.getSettings = async () => ({ enabled: true });
    await sidebar.methods.createdComponent.call(state);
    assert.equal(sidebar.computed.cmsBlocks.call(state), registry);
    state.uctGridBuilderSettingsApiService.getSettings = async () => { throw new Error('Access denied'); };
    await sidebar.methods.createdComponent.call(state);
    assert.deepEqual(Object.keys(sidebar.computed.cmsBlocks.call(state)), ['grid-md-6-6', 'text']);
});

test('registration never overwrites the legacy block or component names', () => {
    const catalog = JSON.parse(readFileSync(new URL('../src/Resources/app/shared/grid-layouts.json', import.meta.url), 'utf8'));
    const registry = { 'grid-md-6-6': { owner: 'legacy' } };
    const components = [];
    const source = readFileSync(new URL('../src/Resources/app/administration/src/module/sw-cms/blocks/ultimate-cms-tools/grid/index.js', import.meta.url), 'utf8')
        .replace(/^import .*;$/gm, '').replace('export default gridBlocks;', '');
    vm.runInNewContext(source, {
        baseComponent: {}, basePreview: { computed: {} }, layouts: catalog,
        getColumns: type => catalog[type].widths.map((width, index) => ({ width, index: index + 1 })),
        Shopware: {
            Component: { register: name => components.push(name) },
            Service: () => ({ registerCmsBlock: block => { registry[block.name] = block; } }),
        },
    });
    assert.equal(registry['grid-md-6-6'].owner, 'legacy');
    assert.equal(Object.keys(registry).length, 12);
    assert.ok(components.every(name => name.includes('uct-grid-')));
    assert.deepEqual(Object.keys(registry['uct-grid-12'].slots), ['content']);
});

test('disabled setting hides only an empty Page Structure category', () => {
    let sidebar;
    const catalog = JSON.parse(readFileSync(new URL('../src/Resources/app/shared/grid-layouts.json', import.meta.url), 'utf8'));
    const source = readFileSync(new URL('../src/Resources/app/administration/src/module/sw-cms/component/sw-cms-sidebar/index.js', import.meta.url), 'utf8').replace(/^import .*;$/gm, '');
    vm.runInNewContext(source, { template: '', layouts: catalog, Shopware: { Component: { override: (_name, value) => { sidebar = value; } } } });
    const categories = [{ value: 'text' }, { value: 'page-structure' }];
    const state = { uctGridBuilderEnabled: false, cmsBlocks: { text: { category: 'text' } }, $super: () => categories };
    assert.deepEqual(Array.from(sidebar.computed.cmsBlockCategories.call(state), item => item.value), ['text']);
    state.cmsBlocks.other = { category: 'page-structure' };
    assert.equal(sidebar.computed.cmsBlockCategories.call(state), categories);
});

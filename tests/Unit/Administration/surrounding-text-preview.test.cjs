const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadPreview() {
    let component;
    const filename = path.join(__dirname, '../../../src/Resources/app/administration/src/component/uct-surrounding-text-preview/index.js');
    const source = fs.readFileSync(filename, 'utf8').replace(/^import .*;$/gm, '');
    vm.runInNewContext(source, { template: '', Shopware: { Component: { register: (_, definition) => { component = definition; } } } });
    return component;
}

test('concurrent intro/outro previews share the configuration request and use configured spacing', async () => {
    for (const value of [0, 37, 1001, null, -1, '24; color:red']) {
        const preview = loadPreview();
        let calls = 0;
        const service = { getValues: async () => { calls += 1; return { 'UltimateCmsTools.config.blockTextSpacing': value }; } };
        const intro = { spacing: 24, systemConfigApiService: service };
        const outro = { spacing: 24, systemConfigApiService: service };
        preview.created.call(intro);
        preview.created.call(outro);
        await new Promise(resolve => setImmediate(resolve));
        const expected = value === 0 ? 0 : value === 37 ? 37 : value === 1001 ? 1000 : 24;
        assert.equal(calls, 1);
        assert.equal(intro.spacing, expected);
        assert.equal(outro.spacing, expected);
        assert.equal(preview.computed.spacingStyle.call(intro)['--uct-preview-text-spacing'], expected + 'px');
    }
});

test('empty sanitized editor markup has no preview, while rich text and images do', () => {
    const preview = loadPreview();
    for (const text of ['', ' ', '<p><br></p>', '<p>&nbsp;</p>', '<p>&#160;</p>', '<p> </p>']) {
        assert.equal(preview.computed.hasText.call({ sanitizedText: text }), false);
    }
    for (const text of ['<h2>Introduction</h2>', '<img src="/image.jpg" alt="Example">']) {
        assert.equal(preview.computed.hasText.call({ sanitizedText: text }), true);
    }
});

test('preview reads the current translated config and delegates HTML sanitization to Shopware', () => {
    const preview = loadPreview();
    let input;
    const element = { config: { uctIntroText: { value: '<h2>Einleitung</h2>' }, uctOutroText: { value: '<p>Abschluss</p>' } } };
    const state = { element, position: 'intro', $sanitize: value => { input = value; return 'sanitized output'; } };
    assert.equal(preview.computed.sanitizedText.call(state), 'sanitized output');
    assert.equal(input, '<h2>Einleitung</h2>');
    state.position = 'outro';
    preview.computed.sanitizedText.call(state);
    assert.equal(input, '<p>Abschluss</p>');
    element.config.uctOutroText.value = '<p>Updated translation</p>';
    preview.computed.sanitizedText.call(state);
    assert.equal(input, '<p>Updated translation</p>');
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/Resources/app/storefront/src/plugin/responsive-image-size.js', import.meta.url), 'utf8');
const { requiredImageWidth } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

// A wide photo covering a square needs enough source width to satisfy frame height.
assert.equal(requiredImageWidth(320, 320, 1600, 800, 'cover'), 704);
// Contained wide logos should use the width of their visible content, without stretching.
assert.equal(requiredImageWidth(256, 154, 1600, 400, 'contain'), 282);
// Portrait logos are limited by frame height, not the surrounding empty horizontal space.
assert.equal(requiredImageWidth(256, 154, 400, 800, 'contain'), 85);
assert.equal(requiredImageWidth(0, 0, 0, 0, 'cover'), 0);
assert.equal(requiredImageWidth(320, 240, 0, 0, 'cover'), 320);
console.log('Responsive source width tests passed.');

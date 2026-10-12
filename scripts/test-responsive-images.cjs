const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const images = require('../lib/responsive-images.json');

test('responsive assets decode, retain the source framing, and match their content hashes', async () => {
  for (const asset of Object.values(images)) for (const variant of asset.variants) {
    const data = fs.readFileSync(path.join(__dirname, '../public', variant.src));
    const metadata = await sharp(data).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, variant.width);
    assert.equal(metadata.height, variant.height);
    assert.equal(data.length, variant.bytes);
    assert.ok(Math.abs(variant.height - variant.width * asset.height / asset.width) <= 1);
    assert.ok(variant.src.endsWith(`-${crypto.createHash('sha256').update(data).digest('hex').slice(0, 12)}.webp`));
  }
});

test('mobile image variants stay within transfer budgets', () => {
  assert.ok(images.logo.variants.find(v => v.width === 192).bytes < 12000);
  for (const key of ['dancer', 'hug']) {
    assert.ok(images[key].variants.find(v => v.width === 800).bytes < 150000);
    assert.ok(images[key].variants.find(v => v.width === 1200).bytes < 280000);
  }
});

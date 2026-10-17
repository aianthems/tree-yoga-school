const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const manifest = require('../lib/bark-background.json');
test('bark variants preserve framing, decode and use immutable content-hash URLs', async () => {
  const css = fs.readFileSync(path.join(__dirname,'../app/globals.css'),'utf8');
  for (const variant of manifest.variants) {
    const bytes = fs.readFileSync(path.join(__dirname,'../public',variant.src));
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format,'webp');
    assert.equal(metadata.width,variant.width); assert.equal(metadata.height,variant.height);
    assert.ok(Math.abs(variant.height - variant.width * manifest.height / manifest.width) <= 1);
    assert.equal(bytes.length,variant.bytes);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),variant.sha256);
    assert.ok(variant.src.endsWith(`-${variant.sha256.slice(0,12)}.webp`));
    assert.ok(css.includes(variant.src));
  }
  assert.ok(!css.includes(manifest.sourceUrl));
  assert.ok(css.includes('--bark-wash: .95') && css.includes('--bark-wash: .97'));
});
test('mobile and desktop bark stay within explicit transfer budgets', () => {
  assert.ok(manifest.variants.find(v=>v.name==='mobile').bytes < 120000);
  assert.ok(manifest.variants.find(v=>v.name==='desktop').bytes < 280000);
});

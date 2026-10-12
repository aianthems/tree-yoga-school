const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {poses}=require('../lib/book-pose-records.json'),source=require('./fixtures/book-poses-source.json');
test('all 87 original book pose headings have unique routable pages and complete instructions',()=>{
 assert.equal(poses.length,87);assert.deepEqual(poses.map(p=>p.title),source.headings);
 assert.equal(new Set(poses.map(p=>p.slug)).size,87);
 for(const p of poses){assert.match(p.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.ok(p.paragraphs.length&&p.paragraphs.every(t=>t.trim().length>30));assert.equal(p.printedPage,p.pdfPage-5);assert.ok(p.endPdfPage>=p.pdfPage&&p.endPdfPage<=85);assert.ok(!fs.existsSync(path.join(__dirname,'../app',p.slug)));}
});
test('the original indexed wrist-circle URL retains its complete book instructions',()=>{
 const p=poses.find(p=>p.slug==='reclined-wrist-circles');assert.equal(p.title,'Reclined Wrist Circles');assert.equal(p.pdfPage,65);assert.equal(p.paragraphs.length,1);assert.ok(p.paragraphs[0].startsWith('Begin in a supine position'));assert.ok(p.paragraphs[0].endsWith('Practice for several breaths, and in both directions.'));
});

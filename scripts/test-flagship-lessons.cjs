const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const { flagshipLessons }=require('../lib/flagship-lessons.ts');
const { lessonPractices }=require('../lib/lesson-practices.ts');
const { bookChapters,bookChapterVideos }=require('../lib/book-chapters.ts');
test('flagship lessons have matching practice routes, valid section anchors and original chapter videos',()=>{
 assert.deepEqual(Object.keys(flagshipLessons).sort(),lessonPractices.map(p=>p.slug).sort());
 for(const [slug,lesson] of Object.entries(flagshipLessons)) {
  assert.ok(bookChapters.some(chapter=>chapter.slug===lesson.videoChapter));
  assert.ok(bookChapterVideos[lesson.videoChapter]?.[0].youtubeId);
  assert.match(lesson.videoDuration,/^\d+:\d{2}$/);
  assert.ok(lesson.original.length>40 && lesson.adaptation.length>40 && lesson.visualPrompt.length>40);
  const source=fs.readFileSync(slug==='first-five-minutes'?'app/lessons/first-five-minutes/page.tsx':'app/lessons/[slug]/page.tsx','utf8');
  for(const id of [lesson.prepareId,lesson.readId,lesson.reflectionId]) assert.ok(source.includes(`id="${id}"`),`${slug} missing ${id}`);
 }
});
test('photographic teaching prompts reuse attributed existing assets',()=>{
 const {getTree}=require('../lib/trees.ts');
 const {treeVisits}=require('../lib/tree-visits.ts');
 const images=[...getTree('pine').detailImages, ...treeVisits.find(v=>v.slug==='gifford-old-growth').destinationPhotos];
 for(const image of images) {
  assert.ok(fs.existsSync('public'+image.image));
  const credit=image.credit||image;
  assert.ok(credit.photographer&&credit.sourceUrl&&credit.licenseUrl);
 }
});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const { lessonPractices, getLessonPractice } = require('../lib/lesson-practices.ts');
const { introLessons } = require('../lib/intro-lessons.ts');
const { firstPractice } = require('../lib/first-practice.ts');
const { trees } = require('../lib/trees.ts');
const { discoveryPages } = require('../lib/site-seo.ts');
test('every core lesson has a distinct discoverable outdoor route and a return to its reflection', () => {
  const slugs = lessonPractices.map(p => p.slug);
  assert.equal(new Set(slugs).size, 4);
  for (const practice of lessonPractices) {
    assert.ok(!trees.some(tree => tree.slug === practice.slug));
    assert.ok(discoveryPages.some(page => page.path === `/practice/${practice.slug}`));
    assert.ok(discoveryPages.some(page => page.path === practice.lessonHref));
    const [path, id] = practice.reflectionHref.split('#');
    assert.equal(path, practice.lessonHref);
    const file = practice.slug === 'first-five-minutes' ? 'app/lessons/first-five-minutes/page.tsx' : 'app/lessons/[slug]/page.tsx';
    assert.ok(fs.readFileSync(file, 'utf8').includes(`id="${id}"`));
  }
});
test('outdoor guides retain lesson-specific steps, preparation, alternatives and reflection', () => {
  for (const lesson of introLessons) {
    const practice = getLessonPractice(lesson.slug);
    assert.deepEqual(practice.steps, lesson.steps);
    assert.deepEqual(practice.options, lesson.options);
    assert.equal(practice.preparation, lesson.preparation);
    assert.equal(practice.duration, lesson.duration);
    assert.equal(practice.reflection, lesson.reflection);
  }
  assert.deepEqual(getLessonPractice('first-five-minutes').steps, firstPractice.steps);
  assert.equal(getLessonPractice('unknown'), undefined);
});

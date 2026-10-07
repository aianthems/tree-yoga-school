const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {PRACTICE_DURATION,remainingTime,startTimer,pauseTimer} = require('../lib/practice-timer.ts');
test('timer catches up after background suspension and never goes negative',()=>{
 const timer=startTimer({remaining:PRACTICE_DURATION,deadline:null},1000);
 assert.equal(remainingTime(timer,121000),180000);
 assert.equal(remainingTime(timer,400000),0);
});
test('pause freezes time and resume uses only the unspent duration',()=>{
 const timer=startTimer({remaining:PRACTICE_DURATION,deadline:null},1000);
 const paused=pauseTimer(timer,61000);
 assert.equal(remainingTime(paused,999000),240000);
 const resumed=startTimer(paused,1000000);
 assert.equal(remainingTime(resumed,1060000),180000);
 assert.equal(remainingTime(resumed,1240000),0);
});
test('a completed timer can start a new five minutes',()=>{
 const timer=startTimer({remaining:0,deadline:null},900000);
 assert.equal(remainingTime(timer,900000),PRACTICE_DURATION);
});

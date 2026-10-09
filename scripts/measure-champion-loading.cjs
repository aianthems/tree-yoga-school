// Run after npm run build. This models the state-data network phase only;
// it is not a browser, Lighthouse score, CPU throttle or real-device timing.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { performance } = require('node:perf_hooks');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { championStates } = require('../lib/champion-states.ts');
const { championDownloadConcurrency } = require('../lib/champion-loader.ts');
const payloads = Object.keys(championStates).map(state => {
  const body = fs.readFileSync(path.join(__dirname, '../.next/server/app/api/champion-trees', `${state}.body`));
  const encoded = zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } });
  return { state, bytes: body.length, encodedBytes: encoded.length, records: JSON.parse(body).trees.length, body: body.toString() };
});
// Idealized HTTP/2: active responses share one bottleneck evenly, each request
// waits one RTT, no packet loss, warm connection, no competing page assets.
function model(concurrency, megabits, rtt) {
  const rate = megabits * 1e6 / 8 / 1000;
  let now = 0, next = 0;
  const active = [], done = [];
  const fill = () => { while (next < payloads.length && active.length < concurrency) active.push({ ...payloads[next++], ready: now + rtt, remaining: payloads[next - 1].encodedBytes }); };
  fill();
  while (active.length) {
    const ready = active.filter(a => a.ready <= now + 1e-7);
    const nextReady = Math.min(...active.filter(a => a.ready > now + 1e-7).map(a => a.ready), Infinity);
    const finish = ready.length ? now + Math.min(...ready.map(a => a.remaining)) * ready.length / rate : Infinity;
    const event = Math.min(nextReady, finish);
    for (const a of ready) a.remaining -= (event - now) * rate / ready.length;
    now = event;
    for (let i = active.length - 1; i >= 0; i--) if (active[i].remaining < 1e-5) { done.push({ state: active[i].state, milliseconds: now }); active.splice(i, 1); }
    fill();
  }
  return { concurrency, firstStateMs: Math.round(done[0].milliseconds), allStatesMs: Math.round(now) };
}
const parses = Array.from({ length: 21 }, () => { const start = performance.now(); for (const p of payloads) JSON.parse(p.body); return performance.now() - start; }).sort((a, b) => a - b);
console.log(JSON.stringify({
  scope: 'Built state payloads; modeled network phase only. Brotli quality 4 estimates wire bytes; CDN encoding may differ. No browser/rendering/phone measurement.',
  states: payloads.length, records: payloads.reduce((n, p) => n + p.records, 0), decodedBytes: payloads.reduce((n, p) => n + p.bytes, 0), estimatedBrotliBytes: payloads.reduce((n, p) => n + p.encodedBytes, 0),
  desktopMedianJsonParseMs: +parses[10].toFixed(2),
  scenarios: [ { megabits: 1.6, rttMs: 150 }, { megabits: 0.4, rttMs: 300 } ].map(s => ({ ...s, before: model(payloads.length, s.megabits, s.rttMs), after: model(championDownloadConcurrency, s.megabits, s.rttMs) })),
}, null, 2));

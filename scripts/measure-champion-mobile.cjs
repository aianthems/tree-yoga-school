// Real Chromium browser runs with mobile emulation and CDP-applied throttling.
// Development-only: requires Playwright and a Chromium executable, not app dependencies.
const { chromium, devices } = require('playwright');
const fs = require('node:fs');
const url = process.env.MAP_TEST_URL || 'https://treeyogaschool.com/champion-trees';
const output = process.env.MAP_TEST_OUTPUT || '/tmp/champion-mobile-results.json';
const proxyUrl = process.env.MAP_TEST_PROXY ? new URL(process.env.MAP_TEST_PROXY) : null;
const proxy = proxyUrl ? { server: proxyUrl.origin, ...(proxyUrl.username ? { username: decodeURIComponent(proxyUrl.username), password: decodeURIComponent(proxyUrl.password) } : {}) } : undefined;
const runs = Number(process.env.MAP_TEST_RUNS || 3);
(async () => {
 const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), headless:true, ...(proxy ? { proxy } : {}), args:['--no-sandbox'] });
 const results = [];
 try {
  for (const profile of [{name:'mobile-1.6Mbps',mbps:1.6,latency:150},{name:'mobile-0.4Mbps',mbps:0.4,latency:300}]) for(let run=1;run<=runs;run++) {
   const context=await browser.newContext({...devices['Pixel 5'],serviceWorkers:'block'});
   const page=await context.newPage();const cdp=await context.newCDPSession(page);
   await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
   await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:profile.latency,downloadThroughput:profile.mbps*1e6/8,uploadThroughput:750000/8});
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   const requests=new Map();const completed=[];const failures=[];let active=0,maxActive=0;
   cdp.on('Network.requestWillBeSent',e=>{requests.set(e.requestId,{url:e.request.url,start:e.timestamp});if(e.request.url.includes('/api/champion-trees/')){active++;maxActive=Math.max(active,maxActive)}});
   cdp.on('Network.loadingFinished',e=>{const req=requests.get(e.requestId);if(req){completed.push({...req,bytes:e.encodedDataLength,end:e.timestamp});if(req.url.includes('/api/champion-trees/'))active--}});
   cdp.on('Network.loadingFailed',e=>{const req=requests.get(e.requestId);if(req){failures.push({...req,error:e.errorText});if(req.url.includes('/api/champion-trees/'))active--}});
   await page.addInitScript(()=>{
    window.__mapMetrics={longTasks:[],firstRecords:null,firstMarkerDOM:null,firstVisibleMarker:null};
    new PerformanceObserver(list=>{for(const e of list.getEntries())window.__mapMetrics.longTasks.push({start:e.startTime,duration:e.duration})}).observe({type:'longtask',buffered:true});
    const scan=()=>{const m=window.__mapMetrics;if(!m.firstRecords&&document.querySelector('#champion-results li'))m.firstRecords=performance.now();const marker=document.querySelector('.champion-marker');if(marker){m.firstMarkerDOM??=performance.now();const b=marker.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight&&b.right>0&&b.left<innerWidth)m.firstVisibleMarker??=performance.now();}};
    new MutationObserver(scan).observe(document,{subtree:true,childList:true});addEventListener('scroll',scan);addEventListener('DOMContentLoaded',scan);
   });
   const started=Date.now();await page.goto(url,{waitUntil:'domcontentloaded',timeout:180000});
   await page.locator('.champion-map').waitFor({timeout:180000});await page.locator('.champion-map').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>document.querySelector('.champion-explorer') && !Array.from(document.querySelectorAll('.champion-explorer [role="status"]')).some(e=>/Loading tree registers|Could not load/.test(e.textContent)) && document.querySelectorAll('.champion-marker').length>0,{},{timeout:180000});
   const fullReady=await page.evaluate(()=>performance.now());
   const initial=await page.evaluate(()=>({...window.__mapMetrics,paint:performance.getEntriesByType('paint').map(e=>({name:e.name,ms:e.startTime})),renderedRecords:document.querySelectorAll('#champion-results li').length,markers:document.querySelectorAll('.champion-marker').length,bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth}));
   const state=page.getByLabel('State',{exact:true});const filterStart=await page.evaluate(()=>performance.now());await state.selectOption('CO');
   await page.waitForFunction(()=>document.querySelector('select[aria-label="State"]')?.value==='CO' && document.querySelectorAll('#champion-results li').length>0 && Array.from(document.querySelectorAll('#champion-results li')).every(e=>e.textContent.includes('CO')),{},{timeout:30000});
   const filterReady=await page.evaluate(()=>performance.now());
   const result={profile:profile.name,run,url,browser:browser.version(),device:'Pixel 5 emulation, 393 × 851, DPR 2.75',cpuSlowdown:4,downloadMbps:profile.mbps,latencyMs:profile.latency,coldBrowserCache:true,fullDataReadyMs:fullReady,filterReadyMs:filterReady-filterStart,maxStateRequests:maxActive,stateResponses:completed.filter(r=>r.url.includes('/api/champion-trees/')).length,encodedStateBytes:completed.filter(r=>r.url.includes('/api/champion-trees/')).reduce((s,r)=>s+r.bytes,0),encodedTotalBytes:completed.reduce((s,r)=>s+r.bytes,0),wallMs:Date.now()-started,failures,...initial};results.push(result);fs.writeFileSync(output,JSON.stringify({measuredAt:new Date().toISOString(),results},null,2)+'\n');console.log(JSON.stringify(result));await context.close();
  }
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});

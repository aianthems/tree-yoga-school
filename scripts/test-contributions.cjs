const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const sharp = require('sharp');
const { validateContribution, contributionHref, contributionPrefill, contributionText, maxSubmissionBytes } = require('../lib/contributions.ts');
const { createContributionToken, verifyContributionToken, readContributionForm, allowContributionAttempt } = require('../lib/contribution-security.ts');
const { contributionAttachments, deliverContribution, contributionDeliveryConfig } = require('../lib/contribution-delivery.ts');
const { GET, POST } = require('../app/api/contributions/route.ts');
function form(topic = 'correction') {
  const data = new FormData();
  for (const [key, value] of Object.entries({ topic, name: 'Test Contributor', email: 'contributor@example.com', reference: 'ma-132', state: 'ma', message: 'The linked official register has an updated measurement.', source: 'https://example.com/register', contactConsent: 'on' })) data.set(key, value);
  return data;
}
const baseTime = Date.now() - 5000;
const config = { key: 'test-key-only', from: 'Tree Yoga School <school@example.com>', to: 'review@example.com' };
function request(data, headers = {}) { return new Request('https://treeyogaschool.com/api/contributions', { method: 'POST', headers: { origin: 'https://treeyogaschool.com', 'user-agent': 'tests', 'x-forwarded-for': '192.0.2.1', ...headers }, body: data }); }
const testIdentity = require('node:crypto').createHash('sha256').update('192.0.2.1|tests').digest('hex');
function withToken(data) { data.set('token', createContributionToken(config.key, testIdentity, baseTime)); return data; }
function env() { const previous = [process.env.RESEND_API_KEY, process.env.CONTRIBUTIONS_FROM_EMAIL, process.env.CONTRIBUTIONS_TO_EMAIL]; process.env.RESEND_API_KEY = config.key; process.env.CONTRIBUTIONS_FROM_EMAIL = config.from; process.env.CONTRIBUTIONS_TO_EMAIL = config.to; return () => { ['RESEND_API_KEY','CONTRIBUTIONS_FROM_EMAIL','CONTRIBUTIONS_TO_EMAIL'].forEach((key,index)=>{if(previous[index]===undefined)delete process.env[key];else process.env[key]=previous[index];}); }; }

test('record correction links prefill exact record and state without copying undisclosed location', () => {
  const url = new URL(contributionHref({ id: 'ca-008', state: 'CA' }), 'https://treeyogaschool.com');
  assert.equal(url.pathname, '/big-tree-volunteers'); assert.equal(url.hash, '#contribute');
  assert.deepEqual(contributionPrefill(Object.fromEntries(url.searchParams)), { topic: 'correction', reference: 'ca-008', state: 'CA' });
  assert.deepEqual(contributionPrefill({ topic: 'not-real', record: '<script>', state: ['MA'] }, 'observation'), { topic: 'observation', reference: '', state: '' });
});
test('validation requires useful corrections, dated observations, consent, and publication credit', () => {
  const data = form(); let value = validateContribution(data, '2026-10-11');
  assert.equal(value.state, 'MA'); assert.equal(value.publishText, false); assert.equal(value.publishPhotos, false);
  assert.match(contributionText(value, []), /NO — private review only/);
  data.delete('reference'); assert.throws(()=>validateContribution(data), /reference/);
  const observation = form('observation'); assert.throws(()=>validateContribution(observation), /observed/);
  for (const date of ['2026-02-31','2026-10-12','not-a-date']) { observation.set('observed',date); assert.throws(()=>validateContribution(observation,'2026-10-11'), /observation date/); }
  observation.set('observed','2026-10-10'); assert.equal(validateContribution(observation,'2026-10-11').observed,'2026-10-10');
  const consent = form(); consent.delete('contactConsent'); assert.throws(()=>validateContribution(consent),/agree/);
  consent.set('contactConsent','on'); consent.set('publishText','on'); assert.throws(()=>validateContribution(consent), /credit/);
  consent.set('credit','Anonymous'); value=validateContribution(consent); assert.equal(value.publishText,true); assert.equal(value.publishPhotos,false);
  assert.match(contributionText(value,[]), /Preferred credit: Anonymous/);
  for (const [field,value] of [['email','a@example.com\r\nBcc: spam@example.com'],['message','x'.repeat(5001)],['source','javascript:alert(1)']]) { const invalid=form();invalid.set(field,value);assert.throws(()=>validateContribution(invalid)); }
});
test('signed tokens reject tampering, different visitors, rapid bots, and expired forms', () => {
  const token=createContributionToken('secret','visitor',baseTime);
  assert.match(verifyContributionToken(token,'secret','visitor'),/^[a-f0-9-]{36}$/);
  assert.throws(()=>verifyContributionToken(token.slice(0,-1)+'z','secret','visitor'));
  assert.throws(()=>verifyContributionToken(token,'secret','other'));
  assert.throws(()=>verifyContributionToken(token,'secret','visitor',baseTime+1000), /take a moment/);
  assert.throws(()=>verifyContributionToken(token,'secret','visitor',baseTime+3600001), /expired/);
  for(let i=0;i<5;i++)assert.equal(allowContributionAttempt('limiter-fixture',baseTime),true);
  assert.equal(allowContributionAttempt('limiter-fixture',baseTime),false);
  assert.equal(allowContributionAttempt('limiter-fixture',baseTime+600001),true);
});
test('body parser enforces limits even without Content-Length and rejects non-form bodies', async () => {
  const data=form(); assert.equal((await readContributionForm(request(data))).get('reference'),'ma-132');
  await assert.rejects(readContributionForm(new Request('https://treeyogaschool.com/api/contributions',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})), error=>error.status===415);
  const stream=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(maxSubmissionBytes+1));controller.close();}});
  await assert.rejects(readContributionForm(new Request('https://treeyogaschool.com/api/contributions',{method:'POST',headers:{'content-type':'multipart/form-data; boundary=x'},body:stream,duplex:'half'})),error=>error.status===413);
});
test('photographs are actually decoded, renamed, resized, and stripped of metadata', async () => {
  const input=await sharp({create:{width:2000,height:1000,channels:3,background:'#123456'}}).jpeg().withMetadata().toBuffer();
  assert.ok((await sharp(input).metadata()).exif);
  const data=form();data.set('photoRights','on');data.append('photos',new File([input],'private-address.jpg',{type:'image/jpeg'}));
  const attachments=await contributionAttachments(data,validateContribution(data));
  assert.equal(attachments[0].filename,'tree-observation-1.jpg');
  const metadata=await sharp(Buffer.from(attachments[0].content,'base64')).metadata();assert.equal(metadata.width,1600);assert.equal(metadata.height,800);assert.equal(metadata.exif,undefined);
  data.delete('photoRights');await assert.rejects(contributionAttachments(data,validateContribution(data)), /permission to share/);
  data.set('photoRights','on');data.set('photos',new File(['not an image'],'fake.jpg',{type:'image/jpeg'}));await assert.rejects(contributionAttachments(data,validateContribution(data)), /could not be read/);
  data.set('photos',new File(['<svg/>'],'unsafe.svg',{type:'image/svg+xml'}));await assert.rejects(contributionAttachments(data,validateContribution(data)), /JPEG/);
});
test('private review mail uses fixed recipient, reply-to, explicit permissions, and stable retry keys', async () => {
  const value=validateContribution(form());const calls=[];
  const send=async(url,options)=>{calls.push({url,options});return Response.json({id:'provider-accepted'});};
  await deliverContribution(value,[],'same-token',config,send);await deliverContribution(value,[],'same-token',config,send);
  const payload=JSON.parse(calls[0].options.body);assert.deepEqual(payload.to,['review@example.com']);assert.equal(payload.reply_to,'contributor@example.com');assert.match(payload.text,/private review only/);assert.equal(calls[0].options.headers['Idempotency-Key'],calls[1].options.headers['Idempotency-Key']);
  await assert.rejects(deliverContribution(value,[],'token',config,async()=>Response.json({error:'secret provider message'},{status:500})), /could not be sent/);
  await assert.rejects(deliverContribution(value,[],'token',config,async()=>{throw Error('timeout');}), /could not confirm/);
});
test('route refuses missing configuration, foreign origins, honeypots, and invalid signed tokens', async () => {
  const restore=env();try {
    delete process.env.RESEND_API_KEY;assert.equal(contributionDeliveryConfig(),null);assert.equal((await GET(new Request('https://treeyogaschool.com/api/contributions'))).status,503);
    process.env.RESEND_API_KEY=config.key;
    assert.equal((await POST(request(form(),{origin:'https://evil.example'}))).status,403);
    assert.equal((await POST(request(form()))).status,400);
    const bot=withToken(form());bot.set('website','spam');assert.equal((await POST(request(bot))).status,400);
    assert.equal((await GET(new Request('https://treeyogaschool.com/api/contributions',{headers:{'sec-fetch-site':'cross-site'}}))).status,403);
  } finally {restore();}
});
test('full route accepts only after provider confirmation and preserves useful errors on failure', async () => {
  const restore=env(), originalFetch=global.fetch;let payload;
  try {
    global.fetch=async(url,options)=>{payload=JSON.parse(options.body);return Response.json({id:'mock-only-no-email-sent'});};
    let response=await POST(request(withToken(form())));assert.equal(response.status,200);assert.deepEqual(await response.json(),{accepted:true});assert.equal(payload.text.includes('ma-132'),true);
    global.fetch=async()=>Response.json({message:'internal provider diagnostic'},{status:500});
    response=await POST(request(withToken(form())));assert.equal(response.status,502);assert.equal((await response.text()).includes('internal provider'),false);
  }finally{global.fetch=originalFetch;restore();}
});

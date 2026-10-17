// Development helper: node scripts/prepare-bark-background.cjs SOURCE_WEBP
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.join(__dirname, '..');
(async () => {
  const source = fs.readFileSync(process.argv[2]);
  const metadata = await sharp(source).metadata();
  const variants = [];
  for (const [name,width,blur,quality] of [['mobile',800,1.2,50],['desktop',1280,1.5,55]]) {
    const data = await sharp(source).rotate().resize({width,withoutEnlargement:true}).blur(blur).webp({quality,effort:6}).toBuffer();
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const src = `/images/responsive/tree-bark-${width}-${hash.slice(0,12)}.webp`;
    const info = await sharp(data).metadata();
    fs.writeFileSync(path.join(root,'public',src),data);
    variants.push({name,src,width:info.width,height:info.height,bytes:data.length,sha256:hash,blur,quality});
  }
  const manifest = {sourceUrl:'https://media.treeyogaschool.com/images/backgrounds/bark/vertical-tree-bark-background-2.webp',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),sourceBytes:source.length,width:metadata.width,height:metadata.height,mobileMaxWidth:760,variants};
  fs.writeFileSync(path.join(root,'lib/bark-background.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify(manifest,null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1;});

const fs = require('node:fs');
const crypto = require('node:crypto');
// Development helper; sharp is supplied by Next.js. Pass a directory containing
// logo.webp, dancer.webp and hug.webp downloaded from the manifest's source URLs.
const path = require('node:path');
const sharp = require('sharp');
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Usage: node scripts/prepare-responsive-images.cjs SOURCE_DIRECTORY');
const output = path.join(__dirname, '../public/images/responsive');
fs.mkdirSync(output, {recursive:true});
(async()=>{
 const manifest = {};
 for(const [key,file,slug,widths] of [
 ['logo','logo','tree-yoga-school-logo',[96,192,320,480,640]],
 ['dancer','dancer','dancer-pose-farandnear',[480,800,1200,1600,2000]],
 ['hug','hug','tree-hug-farandnear',[480,800,1200,1600,2000]]]) {
  const source=fs.readFileSync(path.join(sourceDirectory, file+'.webp'));
  const info=await sharp(source).metadata();
  const variants=[];
  for(const width of widths) {
   const data=await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:key==='logo'?88:82,effort:6}).toBuffer();
   const hash=crypto.createHash('sha256').update(data).digest('hex').slice(0,12);
   const name=`${slug}-${width}-${hash}.webp`;
   fs.writeFileSync(output+'/'+name,data);
   const metadata=await sharp(data).metadata();
   variants.push({src:'/images/responsive/'+name,width:metadata.width,height:metadata.height,bytes:data.length});
  }
  manifest[key]={source:`https://media.treeyogaschool.com/images/${key==='logo'?'logos':'tree-yoga-poses'}/${slug}${key==='logo'?'-v1':''}.webp`,sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),sourceBytes:source.length,width:info.width,height:info.height,variants};
 }
 fs.writeFileSync(path.join(__dirname, '../lib/responsive-images.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log("Prepared responsive image variants and manifest.");
})();

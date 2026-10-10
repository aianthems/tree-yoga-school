// Local benchmark adapter: forwards page assets to next start and serves actual
// built state bodies with Brotli quality 4. This is not a production CDN replica.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const upstream=Number(process.env.MAP_BENCHMARK_UPSTREAM || 3072);
const port=Number(process.env.MAP_BENCHMARK_PORT || 3073);
const bodies=new Map();
for(const file of fs.readdirSync(path.join(__dirname,'../.next/server/app/api/champion-trees')))if(file.endsWith('.body'))bodies.set(file.slice(0,-5),zlib.brotliCompressSync(fs.readFileSync(path.join(__dirname,'../.next/server/app/api/champion-trees',file)),{params:{[zlib.constants.BROTLI_PARAM_QUALITY]:4}}));
http.createServer((req,res)=>{
 const match=/^\/api\/champion-trees\/([A-Z]{2})$/.exec(req.url.split('?')[0]);
 if(match&&bodies.has(match[1])){const body=bodies.get(match[1]);res.writeHead(200,{'Content-Type':'application/json','Content-Encoding':'br','Content-Length':body.length,'Vary':'Accept-Encoding'});res.end(body);return;}
 const proxy=http.request({hostname:'127.0.0.1',port:upstream,path:req.url,method:req.method,headers:req.headers},response=>{res.writeHead(response.statusCode,response.headers);response.pipe(res)});
 proxy.on('error',()=>{res.writeHead(502);res.end('Start the local production build before running the benchmark.');});req.pipe(proxy);
}).listen(port,'127.0.0.1',()=>console.log(`Local Brotli benchmark adapter on ${port}; next start on ${upstream}`));

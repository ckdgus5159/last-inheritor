// Standalone visual rehearsal. No authentication, game API, or database is loaded.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const publicRoot=new URL('../../public/',import.meta.url);
const mime={html:'text/html; charset=utf-8',js:'text/javascript',css:'text/css',jpg:'image/jpeg',svg:'image/svg+xml'};
http.createServer(async(req,res)=>{
 const pathname=new URL(req.url,'http://127.0.0.1').pathname;
 if(pathname==='/'){res.writeHead(302,{Location:'/map-preview.html'}).end();return;}
 const name=pathname.slice(1);
 const preview=/^map-preview\.(html|js|css)$/.test(name);
 const asset=/^(styles\.css|world-map\.(js|css)|emblem\.svg|scenes\/[a-z-]+\.jpg)$/.test(name);
 if(!preview&&!asset){res.writeHead(404).end('Not found');return;}
 try{const file=preview?new URL(name,import.meta.url):new URL(name,publicRoot);const content=await readFile(fileURLToPath(file));res.setHeader('Content-Type',mime[name.split('.').at(-1)]);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');res.end(content);}catch{res.writeHead(404).end('Not found');}
}).listen(4174,'127.0.0.1',()=>console.log('Map rehearsal: http://127.0.0.1:4174/map-preview.html'));

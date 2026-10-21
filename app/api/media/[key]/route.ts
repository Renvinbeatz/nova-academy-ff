import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{key:string}>}) {
 const {key}=await params;if(!/^(video|attachment)-[1-5]-[a-f0-9-]+$/.test(key))return new Response('Arquivo inválido',{status:400});
 const bucket=env.BUCKET;if(!bucket)return new Response('Indisponível',{status:503});
 const object=await bucket.get(key,{range:request.headers});if(!object)return new Response('Arquivo não encontrado',{status:404});
 const headers=new Headers({'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':'private, max-age=3600'});object.writeHttpMetadata(headers);headers.set('ETag',object.httpEtag);
 if(key.startsWith('attachment'))headers.set('Content-Disposition',`attachment; filename*=UTF-8''${encodeURIComponent(object.customMetadata?.name??'material')}`);
 let status=200;
 if(object.range && 'offset' in object.range && 'length' in object.range) {const {offset,length}=object.range;if(offset!==undefined&&length!==undefined){headers.set('Content-Range',`bytes ${offset}-${offset+length-1}/${object.size}`);headers.set('Content-Length',String(length));status=206;}}
 else headers.set('Content-Length',String(object.size));
 return new Response(object.body,{status,headers});
}

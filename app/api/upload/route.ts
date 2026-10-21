import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {owner,readLesson,validVideoUrl,uploadPolicy} from '../../../lib/course-storage';
export const dynamic='force-dynamic';
export async function PUT(request:Request) {
 const u=new URL(request.url);
 const serviceImport=!!env.COURSE_IMPORT_KEY && request.headers.get('x-course-import-key')===env.COURSE_IMPORT_KEY;
 if(!serviceImport && request.headers.get('origin')!==u.origin)return Response.json({error:'Origem não permitida.'},{status:403});
 const user=await getChatGPTUser();if(!user && !serviceImport)return Response.json({error:'Entre na sua conta para editar.'},{status:401});
 const bucket=env.BUCKET;if(!bucket)return Response.json({error:'Armazenamento indisponível.'},{status:503});
 const admin=await owner(bucket);if(!serviceImport && admin && admin!==user?.userId)return Response.json({error:'Somente o responsável pelo curso pode editar.'},{status:403});
 const id=u.searchParams.get('lesson')??'';if(!/^[1-5]$/.test(id))return Response.json({error:'Aula inválida.'},{status:400});
 const kind=u.searchParams.get('kind')??'';
 if(kind!=='video'&&kind!=='attachment')return Response.json({error:'Tipo inválido.'},{status:400});
 if(kind==='attachment'&&id!=='1')return Response.json({error:'O anexo pertence à aula 1.'},{status:400});
 const current=await readLesson(bucket,id);let location:string;let name:string;
 if(u.searchParams.get('mode')==='link') {
   if(kind!=='video')return Response.json({error:'Link disponível apenas para vídeos.'},{status:400});
   const body=await request.json() as {url?:string};if(!body.url||!validVideoUrl(body.url))return Response.json({error:'Use um link HTTPS direto para um arquivo .mp4 ou .webm.'},{status:400});
   location=body.url;name='Vídeo por link';
 } else {
   const size=Number(request.headers.get('content-length'));const type=(request.headers.get('content-type')??'').split(';')[0];
   const error=uploadPolicy(kind,type,size);if(error)return Response.json({error},{status:400});
   if(!request.body)return Response.json({error:'Arquivo vazio.'},{status:400});
   const key=`${kind}-${id}-${crypto.randomUUID()}`;name=(u.searchParams.get('name')??'Arquivo').slice(0,180);
   await bucket.put(key,request.body,{httpMetadata:{contentType:type},customMetadata:{name}});location='/api/media/'+key;
 }
 if(!admin && user)await bucket.put('course-owner',user.userId);
 const previous=current[kind];const updated={...current,[kind]:location,[kind+'Name']:name};
 await bucket.put('lesson-'+id,JSON.stringify(updated),{httpMetadata:{contentType:'application/json'}});
 if(previous?.startsWith('/api/media/'))await bucket.delete(previous.slice('/api/media/'.length));
 return Response.json({ok:true,lesson:updated});
}

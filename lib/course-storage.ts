export type StoredLesson = {video?:string;videoName?:string;attachment?:string;attachmentName?:string};
export async function owner(bucket:R2Bucket) {const o=await bucket.get('course-owner');return o?await o.text():null;}
export async function readLesson(bucket:R2Bucket,id:string):Promise<StoredLesson> {const item=await bucket.get('lesson-'+id);return item?await item.json():{};}
export function validVideoUrl(value:string) {try {const u=new URL(value);return u.protocol==='https:' && /\.(mp4|webm)$/i.test(u.pathname);}catch{return false;}}
export function uploadPolicy(kind:string,type:string,size:number) {
 if(kind!=='video' && kind!=='attachment') return 'Tipo de arquivo inválido.';
 const types=kind==='video'?['video/mp4','video/webm']:['application/pdf','application/zip','application/x-zip-compressed','image/png','image/jpeg'];
 if(!types.includes(type)) return kind==='video'?'Use um vídeo MP4 ou WebM.':'Use PDF, ZIP, PNG ou JPG.';
 if(!Number.isFinite(size)||size<=0||size>(kind==='video'?95:25)*1024*1024) return kind==='video'?'O vídeo deve ter até 95 MB. Para arquivos maiores, use um link direto.':'O anexo deve ter até 25 MB.';
 return null;
}

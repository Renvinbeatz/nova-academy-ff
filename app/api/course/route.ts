import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {owner,readLesson} from '../../../lib/course-storage';
export const dynamic='force-dynamic';
export async function GET() {
 const bucket=env.BUCKET;
 if(!bucket)return Response.json({error:'Armazenamento indisponível.'},{status:503});
 const [user,admin,items]=await Promise.all([getChatGPTUser(),owner(bucket),Promise.all([1,2,3,4,5].map(async id=>[id,await readLesson(bucket,String(id))]))]);
 return Response.json({content:Object.fromEntries(items),canEdit:!!user && (!admin || admin===user.userId)},{headers:{'Cache-Control':'no-store'}});
}

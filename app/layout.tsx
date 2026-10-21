import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'NØVA Academy — Do 0 ao Influencer de FF',description:'Da primeira gravação ao próximo post. Aprenda a criar vídeos de Free Fire em cinco aulas práticas.',icons:{icon:'/nova-logo.png'}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="pt-BR"><body>{children}</body></html>}

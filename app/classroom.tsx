'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowRight,ArrowLeft,Check,ChevronRight,Play,Video,Download,FileText,Upload,X,SlidersHorizontal,Volume2,VolumeX,CheckCircle2,LoaderCircle,Link as LinkIcon,RotateCcw} from 'lucide-react';
import {lessons,lessonArt,type CourseData} from '../lib/lessons';
import {useInterfaceSound} from '../lib/interface-sound';
import NextLesson from './next-lesson';
import VideoPlayer from './video-player';
import MaterialVideo from './material-video';
import {lessonMaterials,type CourseMaterial} from '../lib/materials';
import {formatMediaTime} from '../lib/player-utils';
const storageKey='nova-academy-v1';
export default function Classroom() {
 const [selectedMaterial,setSelectedMaterial]=useState<CourseMaterial|null>(null);
 const [active,setActive]=useState(1);const [tab,setTab]=useState('overview');
 const [courseHome,setCourseHome]=useState(true);const [finished,setFinished]=useState(false);const [autoPlay,setAutoPlay]=useState(false);const [playbackBlocked,setPlaybackBlocked]=useState(false);
 const videoRef=useRef<HTMLVideoElement>(null);const homeTitle=useRef<HTMLHeadingElement>(null);
 const [course,setCourse]=useState<CourseData>({content:{},canEdit:false});
 const [done,setDone]=useState<number[]>([]);const [notes,setNotes]=useState<Record<string,string>>({});
 const [admin,setAdmin]=useState(false);const [error,setError]=useState('');const [videoError,setVideoError]=useState(false);const [ready,setReady]=useState(false);
 const {enabled,toggle,play}=useInterfaceSound();
 const lesson=lessons[active-1];const content=course.content[active]??{};const count=done.length;
 const materials=lessonMaterials[active]??[];
 const nextLesson=lessons[active];const nextAvailable=!!nextLesson&&!!course.content[nextLesson.id]?.video;
 const resumeLesson=lessons.find(item=>!done.includes(item.id)&&course.content[item.id]?.video)?.id??active;
 useEffect(()=>{try {const s=JSON.parse(localStorage.getItem(storageKey)??'{}');setDone(Array.isArray(s.done)?s.done.filter((v:unknown)=>Number.isInteger(v)&&Number(v)>=1&&Number(v)<=5):[]);setNotes(s.notes&&typeof s.notes==='object'?s.notes:{});if(Number.isInteger(s.active)&&s.active>=1&&s.active<=5)setActive(s.active);}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storageKey,JSON.stringify({done,notes,active}));}catch{}},[done,notes,active,ready]);
 useEffect(()=>{const controller=new AbortController();fetch('/api/course',{signal:controller.signal}).then(async r=>{const d=await r.json() as CourseData & {error?:string};if(!r.ok)throw Error(d.error);setCourse(d);}).catch(e=>{if(e.name!=='AbortError')setError('Não foi possível carregar os vídeos. Atualize a página para tentar novamente.');});return()=>controller.abort();},[]);
 useEffect(()=>{
   if(!autoPlay||courseHome||!content.video)return;
   let cancelled=false;
   const attempt=videoRef.current?.play();
   attempt?.catch(error=>{if(cancelled)return;if(error.name==='NotAllowedError')setPlaybackBlocked(true);else if(error.name!=='AbortError')setVideoError(true);});
   return ()=>{cancelled=true;};
 },[active,content.video,autoPlay,courseHome]);
 useEffect(()=>{if(courseHome)homeTitle.current?.focus({preventScroll:true});},[courseHome]);
 function select(id:number){play('switch');setFinished(false);setAutoPlay(false);setPlaybackBlocked(false);setCourseHome(false);setActive(id);setVideoError(false);}
 function goHome(){videoRef.current?.pause();play('tap');setFinished(false);setAutoPlay(false);setPlaybackBlocked(false);setCourseHome(true);setTab('overview');}
 function ended(){
   if(!done.includes(active))play('success');
   setDone(previous=>previous.includes(active)?previous:[...previous,active]);
   setAutoPlay(false);setFinished(true);
   if(document.fullscreenElement)void document.exitFullscreen?.().catch(()=>{});
 }
 function startNext(){
   if(!nextAvailable){goHome();return;}
   play('switch');setFinished(false);setVideoError(false);setPlaybackBlocked(false);setAutoPlay(true);setTab('overview');setActive(nextLesson.id);
 }
 function playCurrent(){setPlaybackBlocked(false);void videoRef.current?.play().catch(error=>{if(error.name==='NotAllowedError')setPlaybackBlocked(true);else if(error.name!=='AbortError')setVideoError(true);});}

 function complete(){play(done.includes(active)?'tap':'success');setDone(v=>v.includes(active)?v.filter(x=>x!==active):[...v,active]);}
 function switchTab(value:string){if(value!==tab)play('tap');setTab(value);}
 function closeAdmin(){play('tap');setAdmin(false);}
 function openMaterial(material:CourseMaterial){videoRef.current?.pause();setFinished(false);play('open');setSelectedMaterial(material);}
 function closeMaterial(){play('tap');setSelectedMaterial(null);}
 return <>
 <header className="topbar"><div className="nav-inner"><a className="brand" href="/" onClick={event=>{event.preventDefault();goHome();}} aria-label="NØVA Academy início"><img src="/nova-logo.png" width="46" height="46" alt="Logo NØVA League"/><span>Academy<small>NØVA League</small></span></a><div className="header-actions"><button className={'sound-button '+(enabled?'':'muted')} onClick={toggle} aria-pressed={enabled} aria-label={enabled?'Desativar sons da interface':'Ativar sons da interface'} title={enabled?'Sons ativados':'Sons desativados'}>{enabled?<Volume2 size={17}/>:<VolumeX size={17}/>}</button>{course.canEdit?<button className="manage" onClick={()=>{play('open');setFinished(false);setAdmin(true);}}><SlidersHorizontal size={15}/><span>Gerenciar conteúdo</span></button>:null}</div></div></header>
 <main className="shell">
 <section className="course-heading"><p className="eyebrow">Mini curso <span>·</span> 5 aulas</p><h1>Do 0 ao Influencer de FF<span>.</span></h1><p>Edição no CapCut, da gameplay à publicação.</p></section>
 {error?<div className="alert" role="alert">{error}</div>:null}
 <div className="workspace">
 <div className="main-column">
 {courseHome?<section className="course-home"><div className="home-visual"><div className="home-orbit"/><img className="home-art" src={lessonArt(resumeLesson)} width="240" height="240" alt=""/><span className="home-art-badge"><Play size={12} fill="currentColor"/>Aula {String(resumeLesson).padStart(2,'0')}</span></div><div className="home-copy"><span className="home-kicker">SEU PRÓXIMO PASSO</span><h2 ref={homeTitle} tabIndex={-1}>{count===0?'Comece a criar.':'Continue de onde parou.'}</h2><p>{lessons[resumeLesson-1].title}</p><button className="primary-btn" onClick={()=>select(resumeLesson)}><Play size={14} fill="currentColor"/>{done.length===5?'Rever aula':'Assistir aula'} {String(resumeLesson).padStart(2,'0')}<ArrowRight size={15}/></button><div className="home-course-meta"><span>5 aulas práticas</span><span>CapCut</span><span>Seu ritmo</span></div></div></section>:<>
 <section className="video-stage" aria-label={'Vídeo da aula '+active}>
 {content.video?<VideoPlayer key={active+":"+content.video} videoRef={videoRef} src={content.video} title={lesson.title} number={active} art={lessonArt(active)} onPlay={()=>{setFinished(false);setPlaybackBlocked(false);}} onError={()=>{setVideoError(true);setFinished(false);setPlaybackBlocked(false);}} onEnded={ended}/>:<div className="video-placeholder"><span className="stage-lesson">Aula {String(active).padStart(2,'0')}</span><div className="empty-video"><img className="empty-lesson-art" src={lessonArt(active)} width="88" height="88" alt=""/><h2>Vídeo em breve</h2><p>A aula aparecerá aqui assim que for adicionada.</p>{course.canEdit?<button onClick={()=>{play('open');setFinished(false);setAdmin(true);}}><Upload size={13}/>Adicionar vídeo</button>:null}</div><span className="format-label">9:16</span></div>}
 {videoError?<div className="video-error" role="alert"><Video size={26}/><strong>Não foi possível reproduzir o vídeo.</strong><p>Confira o arquivo ou o link no painel de conteúdo.</p></div>:null}
 {finished&&nextAvailable?<NextLesson key={active} number={nextLesson.id} title={nextLesson.title} onNext={startNext} onCancel={goHome}/>:null}
 {finished&&!nextAvailable?<div className="next-lesson-overlay lesson-ended" role="status"><CheckCircle2 size={37} strokeWidth={1.3}/><h2>{active===lessons.length?'Você chegou ao fim do curso.':'Aula concluída.'}</h2><p>{active===lessons.length?'Você pode rever as aulas quando quiser.':'A próxima aula estará disponível em breve.'}</p><button className="next-start" onClick={goHome}>Voltar ao curso<ArrowRight size={14}/></button></div>:null}
 {playbackBlocked&&!finished?<div className="next-lesson-overlay"><Play size={30} strokeWidth={1.3}/><h2>Sua próxima aula está pronta.</h2><p>Toque para iniciar a reprodução.</p><button className="next-start" onClick={playCurrent}><Play size={13} fill="currentColor"/>Reproduzir aula</button></div>:null}
 </section>
 <div className="lesson-body">
 <div className="lesson-heading"><div className="current-lesson"><img src={lessonArt(active)} width="44" height="44" alt=""/><div><span className="lesson-eyebrow">Aula {String(active).padStart(2,'0')}</span><h2>{lesson.title}</h2></div></div><button className={'complete-btn '+(done.includes(active)?'is-done':'')} disabled={!content.video} onClick={complete} title={!content.video?'Disponível quando o vídeo for adicionado':undefined}>{done.includes(active)?<CheckCircle2 size={15}/>:<Check size={15}/>}<span>{done.includes(active)?'Concluída':'Concluir aula'}</span></button></div>
 <div className="tabs" role="tablist" aria-label="Informações da aula" onKeyDown={e=>{const values=['overview','materials','notes'];const index=values.indexOf(tab);let next=index;if(e.key==='ArrowRight')next=(index+1)%3;else if(e.key==='ArrowLeft')next=(index+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();switchTab(values[next]);document.getElementById('tab-'+values[next])?.focus();}}>{[{id:'overview',name:'Sobre a aula'},{id:'materials',name:'Materiais'},{id:'notes',name:'Anotações'}].map(t=><button key={t.id} id={'tab-'+t.id} role="tab" tabIndex={tab===t.id?0:-1} aria-selected={tab===t.id} aria-controls={'panel-'+t.id} onClick={()=>switchTab(t.id)} className={tab===t.id?'selected':''}>{t.name}{t.id==='materials'&&materials.length?<span className="materials-count">{materials.length}</span>:null}</button>)}</div>
 <section className="tab-content" role="tabpanel" id={'panel-'+tab} aria-labelledby={'tab-'+tab}>
 {tab==='overview'?<p className="lesson-description">{lesson.description}</p>:null}
 {tab==='materials'?materials.length?<div className="support-materials">{materials.map(material=><article className="support-material" key={material.id}><span className="support-material-icon"><Video size={20}/></span><div className="support-material-info"><h3>{material.name}</h3><p>MP4 · {formatMediaTime(material.duration)} · {material.sizeLabel}</p></div><div className="support-material-actions"><button onClick={()=>openMaterial(material)} aria-label={'Assistir '+material.name}><Play size={13} fill="currentColor"/>Assistir</button><a href={material.url} download={material.fileName} onClick={()=>play('tap')} aria-label={'Baixar '+material.name} title="Baixar vídeo"><Download size={16}/></a></div></article>)}</div>:active===1?(content.attachment?<a className="material-card" href={content.attachment} download onClick={()=>play('tap')}><FileText size={21}/><div><strong>{content.attachmentName}</strong><span>Material de apoio</span></div><Download size={17}/></a>:<p className="empty-material">O material de apoio será adicionado em breve.</p>):<p className="empty-material">Esta aula não possui materiais anexos.</p>:null}
 {tab==='notes'?<><label className="sr-only" htmlFor="notes">Anotações da aula {active}</label><textarea id="notes" value={typeof notes[active]==='string'?notes[active]:''} onChange={e=>setNotes(n=>({...n,[active]:e.target.value}))} placeholder="Suas ideias e anotações…"/><p className="small-note">Salvas automaticamente neste navegador.</p></>:null}
 </section>
 <div className="lesson-nav"><button disabled={active===1} onClick={()=>select(active-1)} aria-label="Aula anterior"><ArrowLeft size={16}/><span>Anterior</span></button><span>{active} de 5</span><button disabled={active===5} onClick={()=>select(active+1)}><span>Próxima aula</span><ArrowRight size={15}/></button></div>
 </div>
 </>}
 </div>
 <aside id="conteudo" className="course-sidebar"><div className="curriculum-heading"><div><span className="curriculum-kicker">PASSO A PASSO</span><h2>Aulas do curso</h2></div><span>05</span></div><div className="lesson-list">{lessons.map(l=><button key={l.id} className={'lesson-row '+(!courseHome&&l.id===active?'active':'')} onClick={()=>select(l.id)} aria-current={!courseHome&&l.id===active?'step':undefined}><span className="lesson-thumb"><img src={lessonArt(l.id)} width="60" height="60" alt="" loading="lazy"/>{done.includes(l.id)?<span className="thumb-done"><Check size={10}/></span>:null}</span><span className="lesson-text"><span className="lesson-meta">Aula {String(l.id).padStart(2,'0')}{!course.content[l.id]?.video?<span> · Em breve</span>:null}</span><strong>{l.title}</strong></span>{!courseHome&&l.id===active?<Play size={12} className="row-play" fill="currentColor"/>:null}</button>)}</div><div className="course-progress"><div><span>Seu progresso</span><strong>{count*20}%</strong></div><div className="progress-track" role="progressbar" aria-label="Progresso do curso" aria-valuemin={0} aria-valuemax={5} aria-valuenow={count}><div style={{width:count*20+'%'}}/></div><p>{count===5?'Curso concluído. Parabéns!':`${count} de 5 aulas concluídas`}</p></div></aside>
 </div>
 <footer className="footer">NØVA League <span>·</span> Academy</footer>
 </main>
 {selectedMaterial?<MaterialVideo material={selectedMaterial} lesson={active} onClose={closeMaterial}/>:null}
 {admin?<ContentManager course={course} onSound={play} onUpdate={data=>{play('success');setCourse(data);}} onClose={closeAdmin}/>:null}
 </>;
}

function ContentManager({course,onUpdate,onClose,onSound}:{course:CourseData;onUpdate:(d:CourseData)=>void;onClose:()=>void;onSound:(kind?:"tap"|"switch"|"open"|"success")=>void}) {
 const [lessonId,setLessonId]=useState(1);const [mode,setMode]=useState('file');const [url,setUrl]=useState('');const [busy,setBusy]=useState(false);const [progress,setProgress]=useState(0);const [message,setMessage]=useState('');const [failed,setFailed]=useState(false);const [drag,setDrag]=useState(false);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=dialog.current;el?.showModal();return()=>el?.close();},[]);
 const current=course.content[lessonId]??{};
 function changeLesson(id:number){onSound("switch");setLessonId(id);setMessage('');setUrl('');}
 async function upload(file:File,kind:'video'|'attachment') {
   if(busy)return;setFailed(false);setMessage('');
   const limit=kind==='video'?95:25;
   if(file.size>limit*1024*1024){setFailed(true);setMessage(`O arquivo deve ter até ${limit} MB.${kind==='video'?' Para vídeos maiores, use um link direto.':''}`);return;}
   const allowed=kind==='video'?['video/mp4','video/webm']:['application/pdf','application/zip','application/x-zip-compressed','image/png','image/jpeg'];
   const type=file.type||(/\.zip$/i.test(file.name)?'application/zip':'');
   if(!allowed.includes(type)){setFailed(true);setMessage(kind==='video'?'Escolha um vídeo MP4 ou WebM.':'Escolha PDF, ZIP, PNG ou JPG.');return;}
   setBusy(true);setProgress(0);
   try {const result=await new Promise<{lesson:typeof current}>((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('PUT',`/api/upload?lesson=${lessonId}&kind=${kind}&name=${encodeURIComponent(file.name)}`);xhr.setRequestHeader('Content-Type',type);xhr.upload.onprogress=e=>{if(e.lengthComputable)setProgress(Math.round(e.loaded/e.total*100));};xhr.onload=()=>{try{const d=JSON.parse(xhr.responseText);if(xhr.status>=200&&xhr.status<300)resolve(d);else reject(Error(d.error??'Não foi possível salvar.'));}catch{reject(Error('O envio falhou. Tente novamente.'));}};xhr.onerror=()=>reject(Error('Conexão interrompida. Tente novamente.'));xhr.send(file);});onUpdate({...course,content:{...course.content,[lessonId]:result.lesson}});setMessage('Conteúdo salvo! Já está disponível nesta aula.');}catch(e){setFailed(true);setMessage(e instanceof Error?e.message:'O envio falhou.');}finally{setBusy(false);}
 }
 async function saveLink(){if(!url.trim())return;setBusy(true);setMessage('');setFailed(false);try{const r=await fetch(`/api/upload?lesson=${lessonId}&kind=video&mode=link`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:url.trim()})});const d=await r.json() as {error?:string;lesson:typeof current};if(!r.ok)throw Error(d.error);onUpdate({...course,content:{...course.content,[lessonId]:d.lesson}});setMessage('Link salvo! O vídeo já está disponível.');setUrl('');}catch(e){setFailed(true);setMessage(e instanceof Error?e.message:'Não foi possível salvar.');}finally{setBusy(false);}}
 return <dialog ref={dialog} className="admin-dialog" aria-labelledby="admin-title" onCancel={e=>{if(busy)e.preventDefault();else onClose();}} onClick={e=>{if(e.target===e.currentTarget&&!busy)onClose();}}><div className="admin-content"><div className="admin-header"><div><h2 id="admin-title">Gerenciar conteúdo</h2></div><button className="icon-btn" onClick={onClose} disabled={busy} aria-label="Fechar painel"><X size={21}/></button></div><p className="admin-intro">Escolha uma aula para adicionar ou substituir o vídeo.</p><label className="field-label" htmlFor="lesson-select">Aula</label><select id="lesson-select" value={lessonId} disabled={busy} onChange={e=>changeLesson(Number(e.target.value))}>{lessons.map(l=><option key={l.id} value={l.id}>Aula {l.id} — {l.title}</option>)}</select><div className="admin-mode"><button disabled={busy} className={mode==='file'?'selected':''} onClick={()=>{onSound('tap');setMode('file');}}><Upload size={15}/>Enviar arquivo</button><button disabled={busy} className={mode==='link'?'selected':''} onClick={()=>{onSound('tap');setMode('link');}}><LinkIcon size={15}/>Usar link</button></div>
 {current.video?<div className="current-file"><CheckCircle2 size={16}/><span>Vídeo atual: {current.videoName??'Vídeo da aula'}</span></div>:null}
 {mode==='file'?<label className={'dropzone '+(drag?'dragging':'')+(busy?' uploading':'')} onDragOver={e=>{e.preventDefault();if(!busy)setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);if(!busy&&e.dataTransfer.files[0])upload(e.dataTransfer.files[0],'video');}}><input type="file" accept="video/mp4,video/webm" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)upload(f,'video');e.target.value='';}}/>{busy?<LoaderCircle className="spin" size={28}/>:<Upload size={28}/>}<strong>{busy?`Enviando… ${progress}%`:'Arraste seu vídeo para cá'}</strong><span>{busy?'Aguarde o envio terminar.':'ou clique para escolher no computador'}</span><small>MP4 ou WebM • Até 95 MB • Vertical 9:16</small></label>:<div className="url-form"><label className="field-label" htmlFor="video-url">Link direto do vídeo</label><input id="video-url" type="url" placeholder="https://seusite.com/aula-01.mp4" value={url} disabled={busy} onChange={e=>setUrl(e.target.value)}/><p>Use um arquivo MP4 ou WebM acessível por HTTPS. Links de páginas do YouTube e do Drive não são links diretos.</p><button className="primary-btn" disabled={busy||!url.trim()} onClick={saveLink}>{busy?<LoaderCircle size={16} className="spin"/>:<Check size={16}/>}Salvar vídeo</button></div>}
 {busy&&mode==='file'?<div className="upload-track"><div style={{width:progress+'%'}}/></div>:null}
 {lessonId===1?<div className="attachment-upload"><div><FileText size={20}/><span><strong>Material de apoio</strong><small>{current.attachmentName??'Adicione o anexo da primeira aula'}</small></span></div><label className="attachment-btn">{current.attachment?'Substituir':'Anexar arquivo'}<input type="file" disabled={busy} accept=".pdf,.zip,.png,.jpg,.jpeg" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f,'attachment');e.target.value='';}}/></label><p>PDF, ZIP, PNG ou JPG • Até 25 MB</p></div>:null}
 {message?<div className={'save-message '+(failed?'failed':'')} role="status">{failed?<RotateCcw size={16}/>:<CheckCircle2 size={16}/>}<span>{message}</span></div>:null}<div className="admin-bottom"><span><CheckCircle2 size={14}/>Alterações salvas a cada envio</span><button className="primary-btn" onClick={onClose} disabled={busy}>Concluído<ArrowUpRight size={15}/></button></div></div></dialog>;
}

'use client';
import {useEffect,useRef,useState} from 'react';
import {X,Download,Video} from 'lucide-react';
import VideoPlayer from './video-player';
import {lessonArt} from '../lib/lessons';
import type {CourseMaterial} from '../lib/materials';

export default function MaterialVideo({material,lesson,onClose}:{material:CourseMaterial;lesson:number;onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);const video=useRef<HTMLVideoElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{
   const trigger=document.activeElement;const modal=dialog.current;const player=video.current;
   modal?.showModal();void player?.play().catch(()=>{});
   return ()=>{player?.pause();modal?.close();if(trigger instanceof HTMLElement)trigger.focus({preventScroll:true});};
 },[]);
 return <dialog ref={dialog} className="material-dialog" aria-labelledby="material-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
   <header className="material-dialog-header"><div><span>Material de apoio · Aula {String(lesson).padStart(2,'0')}</span><h2 id="material-title">{material.name}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Fechar vídeo de apoio"><X size={18}/></button></header>
   <section className="video-stage material-video-stage" aria-label={material.name}><VideoPlayer videoRef={video} src={material.url} title={material.name} number={lesson} art={lessonArt(lesson)} onPlay={()=>{}} onEnded={()=>{}} onError={()=>setFailed(true)}/>{failed?<div className="video-error" role="alert"><Video size={26}/><strong>Não foi possível carregar o vídeo.</strong><p>Você também pode baixar o arquivo abaixo.</p></div>:null}</section>
   <footer className="material-dialog-footer"><span>MP4 · {material.sizeLabel}</span><a className="material-download" href={material.url} download={material.fileName}><Download size={15}/>Baixar vídeo</a></footer>
 </dialog>;
}

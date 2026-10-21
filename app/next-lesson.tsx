'use client';
import {useEffect,useRef,useState} from 'react';
import {Play} from 'lucide-react';
import {startLessonCountdown} from '../lib/lesson-countdown';

export default function NextLesson({title,number,onNext,onCancel}:{title:string;number:number;onNext:()=>void;onCancel:()=>void}) {
  const [seconds,setSeconds]=useState(5);
  const next=useRef(onNext);
  const stop=useRef<(()=>void)|null>(null);
  const cancelButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{next.current=onNext;},[onNext]);
  useEffect(()=>{
    cancelButton.current?.focus({preventScroll:true});
    stop.current=startLessonCountdown({onTick:setSeconds,onFinish:()=>next.current()});
    return ()=>stop.current?.();
  },[]);
  function cancel(){stop.current?.();onCancel();}
  function start(){stop.current?.();next.current();}
  return <div className="next-lesson-overlay" role="dialog" aria-labelledby="next-lesson-title" aria-describedby="next-lesson-description" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();cancel();}}}>
    <span className="next-lesson-kicker">Aula concluída</span>
    <div className="countdown-ring" aria-hidden="true"><svg viewBox="0 0 80 80"><circle className="ring-track" cx="40" cy="40" r="35"/><circle className="ring-progress" cx="40" cy="40" r="35" style={{strokeDashoffset:220*(1-seconds/5)}}/></svg><span>{seconds}</span></div>
    <h2 id="next-lesson-title">Iniciar a próxima aula?</h2>
    <p id="next-lesson-description">Aula {String(number).padStart(2,'0')} · {title}</p>
    <span className="next-lesson-status" role="status">Iniciando em {seconds} {seconds===1?'segundo':'segundos'}…</span>
    <div className="next-lesson-actions"><button ref={cancelButton} className="next-cancel" onClick={cancel}>Cancelar</button><button className="next-start" onClick={start}><Play size={13} fill="currentColor"/>Iniciar agora</button></div>
  </div>;
}

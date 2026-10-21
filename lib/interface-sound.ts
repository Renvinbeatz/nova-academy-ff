'use client';
import {useEffect,useRef,useState} from 'react';
type SoundKind='tap'|'switch'|'open'|'success';
type AudioWindow=Window & {webkitAudioContext?:typeof AudioContext};
export function useInterfaceSound(){
 const [enabled,setEnabled]=useState(true);
 const preference=useRef(true);const audio=useRef<AudioContext|null>(null);const last=useRef(0);
 useEffect(()=>{try{const value=localStorage.getItem('nova-interface-sound')!=='off';preference.current=value;setEnabled(value);}catch{}return()=>{void audio.current?.close();};},[]);
 function play(kind:SoundKind='tap',force=false){
  if(!preference.current&&!force)return;
  if(performance.now()-last.current<65)return;last.current=performance.now();
  try{
   const Context=window.AudioContext||(window as AudioWindow).webkitAudioContext;
   if(!Context)return;
   if(!audio.current||audio.current.state==='closed')audio.current=new Context();
   const ctx=audio.current;const start=()=>{
    const frequencies=kind==='success'?[660,880,1100]:kind==='open'?[440,660]:kind==='switch'?[620]:[880];
    const duration=kind==='success'?.14:.08;
    frequencies.forEach((frequency,index)=>{
     const oscillator=ctx.createOscillator();const gain=ctx.createGain();const time=ctx.currentTime+index*.065;
     oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,time);oscillator.frequency.exponentialRampToValueAtTime(frequency*.92,time+duration);
     gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(kind==='success'?.025:.018,time+.006);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
     oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(time);oscillator.stop(time+duration+.02);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    });
   };
   if(ctx.state==='suspended')void ctx.resume().then(start).catch(()=>{});else start();
  }catch{}
 }
 function toggle(){const next=!preference.current;preference.current=next;setEnabled(next);try{localStorage.setItem('nova-interface-sound',next?'on':'off');}catch{}if(next)play('tap',true);}
 return {enabled,toggle,play};
}

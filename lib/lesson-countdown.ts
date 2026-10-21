type CountdownOptions = {onTick:(seconds:number)=>void;onFinish:()=>void};

export function startLessonCountdown({onTick,onFinish}:CountdownOptions) {
  const deadline=Date.now()+5000;
  let cancelled=false;
  let timer:ReturnType<typeof setTimeout>;
  function tick() {
    if(cancelled)return;
    const remaining=deadline-Date.now();
    if(remaining<=0){cancelled=true;onFinish();return;}
    onTick(Math.ceil(remaining/1000));
    timer=setTimeout(tick,Math.min(1000,remaining));
  }
  tick();
  return ()=>{cancelled=true;clearTimeout(timer);};
}

export function formatMediaTime(value:number) {
  const seconds=Math.max(0,Math.floor(Number.isFinite(value)?value:0));
  const hours=Math.floor(seconds/3600);
  const minutes=Math.floor((seconds%3600)/60);
  const rest=String(seconds%60).padStart(2,'0');
  return hours?`${hours}:${String(minutes).padStart(2,'0')}:${rest}`:`${minutes}:${rest}`;
}
export function seekTarget(value:number,duration:number) {
  if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(value))return 0;
  return Math.min(duration,Math.max(0,value));
}

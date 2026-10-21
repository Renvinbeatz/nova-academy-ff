import {test} from 'node:test';
import assert from 'node:assert/strict';
import {startLessonCountdown} from '../lib/lesson-countdown.ts';

test('waits the full five seconds, announces the countdown, then advances exactly once',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']});
 let advances=0;const ticks=[];
 startLessonCountdown({onTick:value=>ticks.push(value),onFinish:()=>advances++});
 assert.deepEqual(ticks,[5]);
 for(let i=0;i<4;i++)t.mock.timers.tick(1000);
 assert.deepEqual(ticks,[5,4,3,2,1]);assert.equal(advances,0);
 t.mock.timers.tick(999);assert.equal(advances,0);
 t.mock.timers.tick(1);assert.equal(advances,1);
 t.mock.timers.tick(10000);assert.equal(advances,1);
});
test('cancel or navigation prevents all later ticks and automatic advancement',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']});
 let advances=0;const ticks=[];
 const cancel=startLessonCountdown({onTick:value=>ticks.push(value),onFinish:()=>advances++});
 t.mock.timers.tick(2000);cancel();const before=ticks.length;
 t.mock.timers.tick(10000);assert.equal(advances,0);assert.equal(ticks.length,before);
});
test('starting a new countdown after cancellation never fires the old lesson',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date']});
 const advances=[];
 const cancel=startLessonCountdown({onTick:()=>{},onFinish:()=>advances.push('old')});
 t.mock.timers.tick(2000);cancel();
 startLessonCountdown({onTick:()=>{},onFinish:()=>advances.push('new')});
 t.mock.timers.tick(4999);assert.deepEqual(advances,[]);
 t.mock.timers.tick(1);assert.deepEqual(advances,['new']);
});

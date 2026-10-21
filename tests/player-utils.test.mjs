import {test} from 'node:test';
import assert from 'node:assert/strict';
import {formatMediaTime,seekTarget} from '../lib/player-utils.ts';
test('media time handles unavailable metadata and hours without invalid labels',()=>{
 assert.equal(formatMediaTime(NaN),'0:00');assert.equal(formatMediaTime(Infinity),'0:00');assert.equal(formatMediaTime(-5),'0:00');assert.equal(formatMediaTime(125),'2:05');assert.equal(formatMediaTime(414.116667),'6:54');assert.equal(formatMediaTime(3605),'1:00:05');
});
test('seeking stays within real media duration including the 10-second controls at boundaries',()=>{
 assert.equal(seekTarget(3-10,125),0);assert.equal(seekTarget(120+10,125),125);assert.equal(seekTarget(64.25,125),64.25);assert.equal(seekTarget(25,NaN),0);assert.equal(seekTarget(25,0),0);assert.equal(seekTarget(Infinity,125),0);
});

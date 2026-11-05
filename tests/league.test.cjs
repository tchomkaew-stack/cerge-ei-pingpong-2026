// Run: node --test tests/league.test.cjs
// Regression checks for tournament ranking, schedule integrity and Prague time.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
function section(from,to){
  const start=app.indexOf(from),end=app.indexOf(to,start+from.length);
  assert.ok(start>=0&&end>start,'Source markers missing: '+from);
  return app.slice(start,end);
}
const source=[
  section('function compareRank(','function eligibleByGroup('),
  section('function pairKey(','// These are verified'),
  section('function matchTime(','function playerMatchCard('),
  section('function validateScheduleData(','function parseKnockout(')
].join('\n');
const helpers=new Function('sheetKey','scorePair',source+
  ';return {compareRank,unresolvedTie,validateScheduleData,validateResultData,matchTime,pairKey};')(
  x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase(),
  s=>{const m=String(s||'').match(/^(\d+)\s*[-–:]\s*(\d+)$/);return m?[Number(m[1]),Number(m[2])]:null;}
);
const raw=app.match(/const FALLBACK_SCHEDULE=`([\s\S]*?)`\.trim\(\)\.split/);
assert.ok(raw,'Built-in schedule source missing');
const fixtures=raw[1].split('\n').map(line=>{
  const [week,date,time,group,p1,p2]=line.split('|');
  return {week:Number(week),date,time,group,p1,p2};
});
const groups=[...new Set(fixtures.map(x=>x.group))].flatMap(group=>
  [...new Set(fixtures.filter(x=>x.group===group).flatMap(x=>[x.p1,x.p2]))]
    .map(player=>({group,player})));
test('baseline fixture structure contains 105 matches and 42 players',()=>{
  assert.equal(fixtures.length,105);
  assert.equal(groups.length,42);
});
test('schedule validation flags duplicate pairs instead of silently accepting them',()=>{
  const errors=helpers.validateScheduleData(fixtures,groups);
  // This historical fallback contains a repeated C fixture. Do not invent the
  // replacement pairing: correct the actual live Sheet with the organizer.
  assert.ok(errors.some(x=>x.includes('Duplicate fixture')));
});
test('valid scores are accepted; invalid scores and duplicate results are flagged',()=>{
  const m=fixtures[0];
  const good={group:m.group,p1:m.p1,p2:m.p2,winner:m.p1,forfeit:'N',scores:['11-9','11-8','11-7']};
  assert.deepEqual(helpers.validateResultData([good],fixtures),[]);
  assert.ok(helpers.validateResultData([{...good,scores:['11-9','10-8','11-7']}],fixtures).length);
  assert.ok(helpers.validateResultData([good,good],fixtures).some(x=>x.includes('Duplicate')));
});
test('ties stay unresolved instead of being broken alphabetically',()=>{
  const a={player:'Alice',wins:3,winRate:.6,setRatio:.5,pointDiff:2};
  const b={...a,player:'Zoe'};
  assert.equal(helpers.compareRank(a,b),0);
  assert.equal(helpers.unresolvedTie(a,b),true);
});
test('match times are interpreted in Europe/Prague, including DST',()=>{
  assert.equal(helpers.matchTime({date:'2026-11-05',time:'10:00'}),Date.UTC(2026,10,5,9));
  assert.equal(helpers.matchTime({date:'2026-07-05',time:'10:00'}),Date.UTC(2026,6,5,8));
});

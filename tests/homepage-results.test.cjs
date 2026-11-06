const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const helper=app.match(/function homepageVisibleResults\(results\)\s*\{[^}]+\}/)?.[0];
const select=new Function('sortedResults',helper+'; return homepageVisibleResults;')(
  items=>[...items].sort((a,b)=>b.rank-a.rank)
);

test('homepage hides forfeits, including newer forfeits ahead of played matches',()=>{
  const played=Array.from({length:8},(_,i)=>({rank:i+1,forfeit:'N',id:i}));
  const forfeits=[{rank:30,forfeit:'Y'},{rank:29,forfeit:' y '},{rank:28,forfeit:'Y'}];
  assert.deepEqual(select([...played,...forfeits]).map(r=>r.rank),[8,7,6,5,4,3]);
});

test('homepage has no forfeit cards when all results are forfeits',()=>{
  assert.deepEqual(select([{rank:2,forfeit:'Y'},{rank:1,forfeit:'Y'}]),[]);
});

test('homepage does not change recorded results or standings',()=>{
  const records=[{rank:3,forfeit:'Y'},{rank:2,forfeit:'N'},{rank:1,forfeit:'N'}];
  assert.equal(select(records).length,2);
  assert.equal(records.length,3);
  assert.ok(app.includes('const done=new Set(state.results.map(r=>pairKey(r.group,r.p1,r.p2)))'));
  assert.ok(app.includes('const latest=homepageVisibleResults(state.results)'));
  assert.ok(app.includes('const results=sortedResults(state.results.filter('));
});

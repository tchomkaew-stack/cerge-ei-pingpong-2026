// Run: node --test tests/score-bridge.test.cjs
// Exercise the SAME Apps Script doPost used by website scoring and rescheduling.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','integrations','google-apps-script','Code.gs'),'utf8');
function bridge(){
  const results=[
    ['Week','Date','Time','Group','Player 1','Player 2','Game 1','Game 2','Game 3','Game 4','Game 5','Winner','Set score','Forfeit (Y/N)','Last updated'],
    ['1','2026-11-10','15:45','G','Julie Chytilová','Václav Jeřábek','','','','','','','=FORMULA','','']
  ];
  const schedule=[
    ['Week','Date','Time','Group','Player 1','Player 2'],
    ['1','2026-11-10','15:45','G','Julie Chytilová','Václav Jeřábek']
  ];
  const histories={};
  const sheet=(name,rows)=>({
    getName:()=>name,
    getDataRange:()=>({getDisplayValues:()=>rows.map(r=>r.map(v=>String(v)))}),
    getLastColumn:()=>Math.max(...rows.map(r=>r.length)),
    getMaxColumns:()=>Math.max(...rows.map(r=>r.length)),
    insertColumnsAfter(){throw Error('Unexpected insertColumnsAfter')},
    getRange:(row,col,height=1,width=1)=>{
      const range={
        getValues:()=>Array.from({length:height},(_,i)=>rows[row-1+i].slice(col-1,col-1+width)),
        getDisplayValues:()=>Array.from({length:height},(_,i)=>rows[row-1+i].slice(col-1,col-1+width).map(String)),
        getDisplayValue:()=>String(rows[row-1][col-1]||''),
        getNumberFormat:()=> 'yyyy-mm-dd',
        setValue(v){rows[row-1][col-1]=v;return range},
        setValues(v){for(let i=0;i<height;i++)for(let j=0;j<width;j++)rows[row-1+i][col-1+j]=v[i][j];return range},
        setNumberFormat(){return range}
      };
      return range;
    }
  });
  const ss={
    getId:()=> '1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI',
    getSheetByName:name=>name==='Results recording'?sheet('Results recording',results):
      name==='Schedule'?sheet('Schedule',schedule):histories[name]||null,
    insertSheet(name){
      const history={rows:[],appendRow(row){this.rows.push(row)}};
      histories[name]=history;return history;
    }
  };
  const lock={tryLock:()=>true,hasLock:()=>true,releaseLock(){}};
  const environment={
    LockService:{getScriptLock:()=>lock},
    PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'server-secret'})},
    SpreadsheetApp:{openById:id=>{assert.equal(id,'1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI');return ss},flush(){}},
    ContentService:{MimeType:{JSON:'json'},createTextOutput:body=>({body,setMimeType(){return this}})}
  };
  const doPost=new Function('environment',
    'const {LockService,PropertiesService,SpreadsheetApp,ContentService}=environment;\n'+source+'\nreturn doPost;')(environment);
  const send=fields=>{
    const body={secret:'server-secret',group:'G',p1:'Julie Chytilová',p2:'Václav Jeřábek',...fields};
    return JSON.parse(doPost({postData:{contents:JSON.stringify(body)}}).body);
  };
  return {send,results,schedule,histories};
}
test('normal score recording preserves schedule and set-score formula',()=>{
  const b=bridge(),scheduleBefore=JSON.stringify(b.schedule);
  const reply=b.send({forfeit:false,scores:[[11,5],[11,7],[11,8]]});
  assert.equal(reply.ok,true);
  assert.equal(reply.winner,'Julie Chytilová');
  assert.equal(reply.setScore,'3-0');
  assert.deepEqual(b.results[1].slice(6,11),['11-5','11-7','11-8','','']);
  assert.equal(b.results[1][11],'Julie Chytilová');
  assert.equal(b.results[1][12],'=FORMULA');
  assert.equal(b.results[1][13],'N');
  assert.ok(b.results[1][14] instanceof Date);
  assert.equal(JSON.stringify(b.schedule),scheduleBefore);
  assert.equal(b.histories['Result change history'].rows.length,2);
});
test('score correction replaces old scores and records both changes',()=>{
  const b=bridge();
  assert.equal(b.send({forfeit:false,scores:[[11,5],[11,7],[11,8]]}).ok,true);
  const reply=b.send({forfeit:false,scores:[[5,11],[11,7],[7,11],[11,9],[8,11]]});
  assert.equal(reply.ok,true);
  assert.equal(reply.winner,'Václav Jeřábek');
  assert.equal(reply.setScore,'3-2');
  assert.equal(b.results[1][6],'5-11');
  assert.equal(b.results[1][10],'8-11');
  assert.equal(b.results[1][12],'=FORMULA');
  assert.equal(b.histories['Result change history'].rows.length,3);
});
test('forfeit clears games, preserves formula and awards winner',()=>{
  const b=bridge();
  assert.equal(b.send({forfeit:false,scores:[[11,5],[11,7],[11,8]]}).ok,true);
  const reply=b.send({forfeit:true,winner:'Václav Jeřábek',scores:[]});
  assert.equal(reply.ok,true);
  assert.equal(reply.forfeit,true);
  assert.deepEqual(b.results[1].slice(6,11),['','','','','']);
  assert.equal(b.results[1][11],'Václav Jeřábek');
  assert.equal(b.results[1][12],'=FORMULA');
  assert.equal(b.results[1][13],'Y');
});
test('invalid score and unauthorized requests cannot alter data',()=>{
  const b=bridge(),before=JSON.stringify(b.results);
  assert.equal(b.send({forfeit:false,scores:[[13,10],[11,9],[11,8]]}).ok,false);
  assert.equal(b.send({forfeit:false,scores:[[11,5],[11,7],[11,8]],secret:'bad'}).ok,false);
  assert.equal(JSON.stringify(b.results),before);
});
test('reschedule then record score works through same Apps Script',()=>{
  const b=bridge();
  const changed=b.send({action:'reschedule',date:'2026-11-12',time:'16:00'});
  assert.equal(changed.ok,true);
  assert.equal(b.schedule[1][2],'16:00');
  assert.equal(b.results[1][2],'16:00');
  const scored=b.send({forfeit:false,scores:[[11,8],[11,9],[11,7]]});
  assert.equal(scored.ok,true);
  assert.equal(b.results[1][11],'Julie Chytilová');
  assert.equal(b.results[1][12],'=FORMULA');
  assert.equal(b.schedule[1][2],'16:00');
  assert.equal(b.histories['Schedule change history'].rows.length,2);
  assert.equal(b.histories['Result change history'].rows.length,2);
});

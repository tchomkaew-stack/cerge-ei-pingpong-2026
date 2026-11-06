// Run: node --test tests/reschedule.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','integrations','google-apps-script','Code.gs'),'utf8');
function makeBridge(){
  const schedule=[
    ['Week','Date','Time','Group','Player 1','Player 2','Reschedule / Note'],
    ['1','2026-11-06','09:30','G','Julie Chytilová','Václav Jeřábek','']
  ];
  const results=[['Group','Player 1','Player 2'],['G','Julie Chytilová','Václav Jeřábek']];
  let history=null;
  const sheet={
    getDataRange:()=>({getDisplayValues:()=>schedule.map(row=>[...row])}),
    getRange:(row,col)=>{
      const cell={
        setValue(value){schedule[row-1][col-1]=value;return cell},
        setNumberFormat(){return cell}
      };
      return cell;
    }
  };
  const ss={
    getId:()=> '1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI',
    getSheetByName:name=>name==='Schedule'?sheet:name==='Schedule change history'?history:null,
    insertSheet:name=>{
      assert.equal(name,'Schedule change history');
      history={rows:[],appendRow(row){this.rows.push(row)}};
      return history;
    }
  };
  const lock={tryLock:()=>true,hasLock:()=>true,releaseLock(){}};
  const environment={
    LockService:{getScriptLock:()=>lock},
    PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'server-secret'})},
    SpreadsheetApp:{getActiveSpreadsheet:()=>ss,flush(){}},
    ContentService:{
      MimeType:{JSON:'json'},
      createTextOutput:body=>({body,setMimeType(){return this}})
    }
  };
  const doPost=new Function('environment',
    'const {LockService,PropertiesService,SpreadsheetApp,ContentService}=environment;\n'+
    source+'\nreturn doPost;')(environment);
  const send=changes=>{
    const body={secret:'server-secret',action:'reschedule',group:'G',
      p1:'Julie Chytilová',p2:'Václav Jeřábek',
      date:'2026-11-10',time:'15:45',...changes};
    return JSON.parse(doPost({postData:{contents:JSON.stringify(body)}}).body);
  };
  return {send,schedule,results,history:()=>history};
}
test('rescheduling updates only Schedule date/time and logs a history entry',()=>{
  const bridge=makeBridge(),before=JSON.stringify(bridge.results);
  const result=bridge.send({});
  assert.equal(result.ok,true);
  assert.equal(bridge.schedule[1][2],'15:45');
  assert.ok(bridge.schedule[1][1] instanceof Date);
  assert.equal(bridge.schedule[1][0],'1');
  assert.equal(bridge.schedule[1][3],'G');
  assert.equal(bridge.schedule[1][4],'Julie Chytilová');
  assert.equal(JSON.stringify(bridge.results),before);
  assert.equal(bridge.history().rows.length,2);
});
test('players may be supplied in either order',()=>{
  const bridge=makeBridge();
  const result=bridge.send({p1:'Václav Jeřábek',p2:'Julie Chytilová'});
  assert.equal(result.ok,true);
});
test('invalid dates, times, unknown matches and wrong secret are rejected',()=>{
  const bridge=makeBridge();
  for(const changes of [
    {date:'2026-11-31'},{time:'25:30'},{date:'2025-10-10'},
    {p2:'Other Player'},{secret:'wrong'}
  ])assert.equal(bridge.send(changes).ok,false);
  assert.equal(bridge.schedule[1][1],'2026-11-06');
  assert.equal(bridge.history(),null);
});

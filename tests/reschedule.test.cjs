// Run: node --test tests/reschedule.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','integrations','google-apps-script','Code.gs'),'utf8');

function makeBridge({missingResults=false,duplicateResults=false,failScheduleWrite=false}={}){
  const schedule=[
    ['Week','Date','Time','Group','Player 1','Player 2','Reschedule / Note'],
    ['1','2026-11-06','09:30','G','Julie Chytilová','Václav Jeřábek','']
  ];
  const results=[
    ['Week','Date','Time','Group','Player 1','Player 2','Game 1','Game 2','Game 3','Game 4','Game 5','Winner'],
    ['1','2026-11-05','13:00','G','Julie Chytilová',
      missingResults?'Other Player':'Václav Jeřábek','11-7','11-9','11-8','','','Julie Chytilová']
  ];
  if(duplicateResults)results.push([...results[1]]);
  let history=null,failOnce=failScheduleWrite;
  function sheet(name,rows){
    return {
      getName:()=>name,
      getDataRange:()=>({getDisplayValues:()=>rows.map(row=>row.map(x=>String(x)))}),
      getRange:(row,col,nrows=1,ncols=1)=>{
        const cell={
          getValues:()=>Array.from({length:nrows},(_,i)=>rows[row+i-1].slice(col-1,col-1+ncols)),
          getDisplayValues:()=>Array.from({length:nrows},(_,i)=>
            rows[row+i-1].slice(col-1,col-1+ncols).map(x=>String(x))),
          getNumberFormat:()=> 'yyyy-mm-dd',
          setValues(values){
            if(name==='Schedule'&&failOnce){failOnce=false;throw Error('Simulated Schedule write failure')}
            for(let i=0;i<nrows;i++)for(let j=0;j<ncols;j++)rows[row+i-1][col+j-1]=values[i][j];
            return cell;
          },
          setNumberFormat(){return cell}
        };
        return cell;
      }
    };
  }
  const scheduleSheet=sheet('Schedule',schedule),resultsSheet=sheet('Results recording',results);
  const ss={
    getId:()=> '1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI',
    getSheetByName:name=>name==='Schedule'?scheduleSheet:
      name==='Results recording'?resultsSheet:
      name==='Schedule change history'?history:null,
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
    SpreadsheetApp:{openById:id=>{assert.equal(id,'1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI');return ss},flush(){}},
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
test('rescheduling synchronizes both tabs and preserves score data',()=>{
  const bridge=makeBridge();
  const beforeScores=JSON.stringify(bridge.results[1].slice(3));
  const result=bridge.send({});
  assert.equal(result.ok,true);
  for(const tab of [bridge.schedule,bridge.results]){
    assert.equal(tab[1][2],'15:45');
    assert.ok(tab[1][1] instanceof Date);
    assert.equal(tab[1][1].getFullYear(),2026);
    assert.equal(tab[1][1].getMonth(),10);
    assert.equal(tab[1][1].getDate(),10);
    assert.equal(tab[1][0],'1');
  }
  assert.equal(JSON.stringify(bridge.results[1].slice(3)),beforeScores);
  assert.equal(bridge.history().rows.length,2);
  assert.equal(bridge.history().rows[1][4],'2026-11-06');
  assert.equal(bridge.history().rows[1][6],'2026-11-05');
});
test('match can be found with player names in either order',()=>{
  const bridge=makeBridge();
  const result=bridge.send({p1:'Václav Jeřábek',p2:'Julie Chytilová'});
  assert.equal(result.ok,true);
  assert.equal(bridge.results[1][2],'15:45');
});
test('invalid dates, times, unknown matches and wrong secret change neither tab',()=>{
  const bridge=makeBridge();
  for(const changes of [
    {date:'2026-11-31'},{time:'25:30'},{date:'2025-10-10'},
    {p2:'Other Player'},{secret:'wrong'}
  ])assert.equal(bridge.send(changes).ok,false);
  assert.equal(bridge.schedule[1][1],'2026-11-06');
  assert.equal(bridge.results[1][1],'2026-11-05');
  assert.equal(bridge.history(),null);
});
test('missing or duplicate result rows block both updates',()=>{
  for(const option of [{missingResults:true},{duplicateResults:true}]){
    const bridge=makeBridge(option);
    assert.equal(bridge.send({}).ok,false);
    assert.equal(bridge.schedule[1][1],'2026-11-06');
    assert.equal(bridge.results[1][1],'2026-11-05');
  }
});
test('failed second-sheet write rolls back the first-sheet write',()=>{
  const bridge=makeBridge({failScheduleWrite:true});
  const result=bridge.send({});
  assert.equal(result.ok,false);
  assert.match(result.error,/restored/i);
  assert.equal(bridge.schedule[1][1],'2026-11-06');
  assert.equal(bridge.results[1][1],'2026-11-05');
  assert.equal(bridge.results[1][2],'13:00');
  assert.equal(bridge.history(),null);
});

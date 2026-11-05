/**
 * @OnlyCurrentDoc
 * CERGE-EI Ping Pong League 2026: simple participant score recording bridge.\n * Players do not need an account or PIN. The shared secret is server-side only.
 * Deploy as a Google Apps Script Web App, executing as the Sheet owner.
 * Set Script Property SCORE_WRITE_SECRET to exactly the same random secret
 * as Cloudflare Pages' SCORE_WRITE_SECRET secret variable.
 * Do NOT publish this secret or use the spreadsheet editor link as the endpoint.
 */
const SCORE_SHEET = 'Results recording';

function respond_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
function normalized_(v) {
  return String(v == null ? '' : v).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}
function validateScores_(scores) {
  if (!Array.isArray(scores) || scores.length < 3 || scores.length > 5) throw Error('Enter 3 to 5 completed games.');
  let a=0,b=0;
  const strings=[];
  scores.forEach((pair,index) => {
    if (a===3 || b===3) throw Error('Do not enter games after someone has won three.');
    if (!Array.isArray(pair) || pair.length!==2) throw Error('Invalid game '+(index+1));
    const x=pair[0],y=pair[1];
    if (!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>99||y>99 ||
        Math.max(x,y)<11 || Math.abs(x-y)<2 ||
        (Math.max(x,y)>11 && Math.abs(x-y)!==2)) throw Error('Invalid score in game '+(index+1));
    if(x>y)a++;else b++;
    strings.push(x+'-'+y);
  });
  if (Math.max(a,b)!==3) throw Error('A completed match must have three game wins.');
  return {strings,wins:[a,b]};
}
function doPost(e) {
  const lock=LockService.getScriptLock();
  try {
    if (!lock.tryLock(10000)) throw Error('Another result is being saved. Try again.');
    const body=JSON.parse(e.postData.contents || '{}');
    const expected=PropertiesService.getScriptProperties().getProperty('SCORE_WRITE_SECRET');
    if (!expected || body.secret!==expected) throw Error('Submission not authorized.');
    if(!/^[A-G]$/.test(String(body.group||'')))throw Error('Invalid group.');
    const p1=String(body.p1||'').trim(),p2=String(body.p2||'').trim();
    if(!p1 || !p2 || normalized_(p1)===normalized_(p2)) throw Error('Invalid players.');
    const isForfeit=body.forfeit===true;
    if(body.forfeit!==true&&body.forfeit!==false)throw Error('Invalid result type.');
    const data=isForfeit?null:validateScores_(body.scores);
    if(isForfeit && (!body.winner || ![normalized_(p1),normalized_(p2)].includes(normalized_(body.winner)) ||
       (Array.isArray(body.scores)&&body.scores.length)))throw Error('Choose a valid forfeit winner and leave scores empty.');
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    if (!ss || ss.getId() !== '1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI') throw Error('This script must be bound to the tournament spreadsheet.');
    const sheet=ss.getSheetByName(SCORE_SHEET);
    if(!sheet)throw Error('Results recording tab not found.');
    const all=sheet.getDataRange().getDisplayValues();
    const headings=all.findIndex(row =>
      normalized_(row[4])==='player 1' && normalized_(row[5])==='player 2'
      && normalized_(row[11])==='winner');
    if(headings<0)throw Error('Result sheet columns have changed. Please contact the organizer.');
    let found=-1;
    for(let i=headings+1;i<all.length;i++){
      const row=all[i];
      if(normalized_(row[3])===normalized_(body.group) &&
         normalized_(row[4])===normalized_(p1) &&
         normalized_(row[5])===normalized_(p2)){
        if(found>=0)throw Error('Duplicate match rows found; ask the organizer to review.');
        found=i;
      }
    }
    if(found<0)throw Error('Match not found in Results recording. Ask the organizer to check the schedule.');
    const row=all[found];
    const before={
      scores:row.slice(6,11),
      winner:String(row[11]||''),
      forfeit:''
    };
    // The sheet's set-score formula in M is never overwritten.
    // Keep the forfeit flag in a dedicated named column, creating it at the end if needed.
    const headers=all[headings].map(normalized_);
    let forfeitCol=headers.findIndex(x=>x==='forfeit (y/n)'||x==='forfeit'||x==='forfeit y/n')+1;
    if(!forfeitCol){
      forfeitCol=Math.max(sheet.getLastColumn()+1,14);
      sheet.getRange(headings+1,forfeitCol).setValue('Forfeit (Y/N)');
    }
    before.forfeit=String(sheet.getRange(found+1,forfeitCol).getDisplayValue()||'');
    const winner=isForfeit
      ? (normalized_(body.winner)===normalized_(p1)?String(row[4]).trim():String(row[5]).trim())
      : (data.wins[0]===3?String(row[4]).trim():String(row[5]).trim());
    const scores=isForfeit?Array(5).fill(''):Array.from({length:5},(_,i)=>data.strings[i]||'');
    const setScore=isForfeit?'':data.wins.join('-');
    sheet.getRange(found+1,7,1,5).setValues([scores]);
    sheet.getRange(found+1,12).setValue(winner);
    sheet.getRange(found+1,forfeitCol).setValue(isForfeit?'Y':'N');
    let updatedCol=headers.findIndex(x=>x==='last updated'||x==='updated at'||x==='recorded at')+1;
    if(!updatedCol){
      updatedCol=Math.max(sheet.getLastColumn()+1,forfeitCol+1);
      sheet.getRange(headings+1,updatedCol).setValue('Last updated');
    }
    sheet.getRange(found+1,updatedCol).setValue(new Date()).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    SpreadsheetApp.flush();
    // Record the previous and new values for transparent, self-service corrections.
    let auditLogged=true,auditWarning='';
    try{
      let audit=ss.getSheetByName('Result change history');
      if(!audit){
        audit=ss.insertSheet('Result change history');
        audit.appendRow(['Timestamp','Group','Player 1','Player 2','Previous scores','Previous winner','Previous forfeit','New scores','New winner','New forfeit']);
      }
      audit.appendRow([new Date(),body.group,p1,p2,before.scores.join(' | '),before.winner,before.forfeit,scores.join(' | '),winner,isForfeit?'Y':'N']);
    }catch(auditError){
      auditLogged=false;
      auditWarning='Result saved, but change history could not be recorded: '+String(auditError.message||auditError);
    }
    return respond_({ok:true,winner,setScore,forfeit:isForfeit,auditLogged,auditWarning});

  } catch (err) {
    return respond_({ok:false,error:String(err.message||err)});
  } finally {
    if(lock.hasLock())lock.releaseLock();
  }
}

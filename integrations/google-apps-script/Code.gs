/**
 * CERGE-EI Ping Pong League 2026: authorized score recording bridge.
 * Deploy as a Google Apps Script Web App, executing as the Sheet owner.
 * Set Script Property SCORE_WRITE_SECRET to exactly the same random secret
 * as Cloudflare Pages' SCORE_WRITE_SECRET secret variable.
 * Do NOT publish this secret or use the spreadsheet editor link as the endpoint.
 */
const SPREADSHEET_ID = '1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI';
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
    const data=validateScores_(body.scores);
    const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
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
    if(String(row[11]).trim() || row.slice(6,11).some(v=>String(v).trim()))
      throw Error('This match already has a result. Ask the organizer to correct it.');
    const winner=data.wins[0]===3 ? String(row[4]).trim() : String(row[5]).trim();
    // Write exactly G:K (scores) and L (winner); preserve column M formulas.
    sheet.getRange(found+1,7,1,5).setValues([Array.from({length:5},(_,i)=>data.strings[i]||'')]);
    sheet.getRange(found+1,12).setValue(winner);
    SpreadsheetApp.flush();
    return respond_({ok:true,winner,setScore:data.wins.join('-')});
  } catch (err) {
    return respond_({ok:false,error:String(err.message||err)});
  } finally {
    if(lock.hasLock())lock.releaseLock();
  }
}

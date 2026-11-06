// Run: node --test tests/player-copy.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
test('participant-facing HTML avoids organizer/developer instructions',()=>{
  for(const phrase of [
    'No login','No PIN','organizer approval','awaiting organizer setup',
    'Apps Script deployment','Manual fallback','The manual instructions below remain available as a fallback',
    'This updates the date and time in <strong>both Schedule and Results recording</strong>'
  ])assert.ok(!html.includes(phrase),'Unexpected organizer-facing copy: '+phrase);
  assert.ok(html.includes('id="rescheduleForm"'));
  assert.ok(html.includes('id="scoreEntryForm"'));
  assert.ok(html.includes('<details class="score-manual-help"><summary>Prefer Google Sheets? View instructions</summary>'));
});
test('participant status and submission messages avoid backend diagnostics',()=>{
  for(const phrase of [
    'Live results · schedule cached','Schedule cached · check before playing',
    'Live updates limited','Direct score recording is awaiting organizer setup',
    'Website rescheduling is awaiting the updated Google Apps Script deployment',
    'The schedule has not passed every integrity check',
    'Displaying the latest sheet.'
  ]) {
    // The last phrase is retained only as a console diagnostic, not a player-facing status.
    if(phrase==='Displaying the latest sheet.')continue;
    assert.ok(!app.includes(phrase),'Unexpected participant status: '+phrase);
  }
  assert.ok(app.includes('console.warn("Tournament data diagnostics:"'));
  assert.ok(app.includes('playerSubmissionError(err.message,"score")'));
  assert.ok(app.includes('playerSubmissionError(err.message,"reschedule")'));
});

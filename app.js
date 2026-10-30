const SHEET_ID="1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI";
const state={groups:[],schedule:[],results:[],standings:[]};

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").trim();
const num=v=>{const n=parseFloat(String(v??"").replace("%",""));return Number.isFinite(n)?n:0};
const pct=v=>v===""||v==null?"—":(Number(v)*100).toFixed(0)+"%";

function parseCSV(text){
  const rows=[];let row=[],cell="",q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(c=='"'&&q&&n=='"'){cell+='"';i++}
    else if(c=='"'){q=!q}
    else if(c==","&&!q){row.push(cell);cell=""}
    else if((c==="\n"||c==="\r")&&!q){
      if(c==="\r"&&n==="\n")i++;
      row.push(cell);cell="";
      if(row.some(x=>x!==""))rows.push(row);
      row=[];
    }else cell+=c;
  }
  if(cell||row.length){row.push(cell);if(row.some(x=>x!==""))rows.push(row)}
  return rows;
}
async function fetchSheet(name){
  const url="/api/sheet?sheet="+encodeURIComponent(name);
  const r=await fetch(url,{cache:"no-store"});
  const text=await r.text();
  if(!r.ok){
    throw new Error(name+": HTTP "+r.status+(text?(" — "+text.slice(0,160)):""));
  }
  if(text.trim().startsWith("<")){
    throw new Error(name+": API returned HTML instead of CSV");
  }
  const rows=parseCSV(text);
  if(!rows.length) throw new Error(name+": empty response");
  return rows;
}
function headerIndex(rows,test){return rows.findIndex(test)}
function parseGroups(rows){
  const h=headerIndex(rows,r=>norm(r[0]).toLowerCase()=="group"&&norm(r[1]).toLowerCase()=="player");
  if(h<0)return[];
  return rows.slice(h+1).filter(r=>/^[A-G]$/.test(norm(r[0]))&&norm(r[1]))
    .map(r=>({group:norm(r[0]),player:norm(r[1]),role:norm(r[2])}));
}
function parseSchedule(rows){
  const h=headerIndex(rows,r=>norm(r[0]).toLowerCase()=="week"&&norm(r[3]).toLowerCase()=="group");
  if(h<0)return[];
  return rows.slice(h+1).filter(r=>norm(r[0])&&norm(r[4])&&norm(r[5]))
    .map(r=>({week:parseInt(r[0])||0,date:norm(r[1]),time:norm(r[2]),group:norm(r[3]),p1:norm(r[4]),p2:norm(r[5])}));
}
function parseResults(rows){
  const h=headerIndex(rows,r=>norm(r[0]).toLowerCase()=="week"&&norm(r[11]).toLowerCase()=="winner");
  if(h<0)return[];
  return rows.slice(h+1).filter(r=>norm(r[4])&&norm(r[5])&&norm(r[11]))
    .map(r=>({date:norm(r[1]),group:norm(r[3]),p1:norm(r[4]),p2:norm(r[5]),winner:norm(r[11]),setScore:norm(r[12]),forfeit:norm(r[13])}));
}
function parseStandings(rows){
  const h=headerIndex(rows,r=>norm(r[0]).toLowerCase()=="group"&&norm(r[1]).toLowerCase()=="player"&&norm(r[2]).toLowerCase()=="wins");
  if(h<0)return[];
  return rows.slice(h+1).filter(r=>/^[A-G]$/.test(norm(r[0]))&&norm(r[1]))
    .map(r=>({group:norm(r[0]),player:norm(r[1]),wins:num(r[2]),losses:num(r[3]),matches:num(r[7]),winRate:r[8]===""?"":num(r[8]),setRatio:r[10]===""?"":num(r[10]),pointDiff:r[11]===""?"":num(r[11])}));
}
function compareRank(a,b){
  return b.wins-a.wins||b.winRate-a.winRate||b.setRatio-a.setRatio||b.pointDiff-a.pointDiff||a.player.localeCompare(b.player);
}
function eligibleByGroup(){
  const out={};for(const g of "ABCDEFG")out[g]=state.standings.filter(x=>x.group===g&&x.matches>=3).sort(compareRank);
  return out;
}
function wildcards(){
  const e=eligibleByGroup(),a=[];for(const g of "ABCDEFG")if(e[g]?.[2])a.push(e[g][2]);return a.sort(compareRank);
}
function fmtDate(s){
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)){
    const [y,m,d]=s.split("-").map(Number);
    return new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"2-digit",month:"short"}).format(new Date(Date.UTC(y,m-1,d)));
  }
  return s;
}
function pairKey(g,a,b){return g+":"+[a,b].sort().join("|")}
function matchCard(m){return `<div class="match-card"><div class="match-meta">Week ${m.week} • ${esc(fmtDate(m.date))} • ${esc(m.time)} • Group ${m.group}</div><div class="match-main">${esc(m.p1)} <b>vs</b> ${esc(m.p2)}</div></div>`}

async function refreshData(){
  const status=$("liveStatus");
  status.textContent="Connecting to live sheet…";status.className="status-pill";

  const names=["Groups","Schedule","Results recording","Standing"];
  const loaded={};
  const errors=[];

  for(const name of names){
    try{ loaded[name]=await fetchSheet(name); }
    catch(e){ errors.push(e.message||String(e)); }
  }

  if(loaded["Groups"]) state.groups=parseGroups(loaded["Groups"]);
  if(loaded["Schedule"]) state.schedule=parseSchedule(loaded["Schedule"]);
  if(loaded["Results recording"]) state.results=parseResults(loaded["Results recording"]);
  if(loaded["Standing"]) state.standings=parseStandings(loaded["Standing"]);

  const coreOk=state.groups.length>0 && state.schedule.length>0;
  if(coreOk && errors.length===0){
    status.textContent="Live data connected";
    status.className="status-pill live";
    status.title="Groups "+state.groups.length+" • Schedule "+state.schedule.length+" • Results "+state.results.length+" • Standings "+state.standings.length;
  }else if(coreOk){
    status.textContent="Live data partially connected";
    status.className="status-pill fallback";
    status.title=errors.join("\n");
  }else{
    status.textContent="Live data unavailable";
    status.className="status-pill fallback";
    status.title=(errors.length?errors.join("\n"):"Parsed Groups "+state.groups.length+", Schedule "+state.schedule.length);
    console.error("Live data diagnostics:",errors,{groups:state.groups.length,schedule:state.schedule.length,results:state.results.length,standings:state.standings.length});
  }
  renderAll();
}
function renderHome(){
  const done=new Set(state.results.map(r=>pairKey(r.group,r.p1,r.p2)));
  const next=state.schedule.filter(m=>!done.has(pairKey(m.group,m.p1,m.p2))).slice(0,6);
  $("nextMatches").innerHTML=next.length?next.map(matchCard).join(""):"All group-stage matches completed.";
  const latest=[...state.results].slice(-6).reverse();
  $("latestResults").innerHTML=latest.length?latest.map(r=>`<div class="result-card"><div class="match-meta">${esc(r.date)} • Group ${r.group}</div><div><strong>${esc(r.winner)}</strong> won ${esc(r.setScore)} ${r.forfeit==="Y"?"(W/O)":""}</div><div class="small-note">${esc(r.p1)} vs ${esc(r.p2)}</div></div>`).join(""):"No results recorded yet.";
  renderMyMatches();
}
function renderMyMatches(){
  const q=norm($("homePlayerSearch").value).toLowerCase(),el=$("myMatches");
  if(q.length<2){el.innerHTML="";return}
  const a=state.schedule.filter(m=>m.p1.toLowerCase().includes(q)||m.p2.toLowerCase().includes(q));
  el.innerHTML=a.length?a.map(matchCard).join(""):'<p class="muted-empty">No matching player found.</p>';
}
function renderSchedule(){
  const q=norm($("scheduleSearch").value).toLowerCase(),g=$("groupFilter").value,w=$("weekFilter").value;
  const a=state.schedule.filter(m=>(!g||m.group===g)&&(!w||String(m.week)===w)&&(!q||m.p1.toLowerCase().includes(q)||m.p2.toLowerCase().includes(q)));
  $("scheduleTableWrap").innerHTML=`<div class="table-wrap"><table><thead><tr><th>Week</th><th>Date</th><th>Time</th><th>Group</th><th>Player 1</th><th>Player 2</th></tr></thead><tbody>${a.map(m=>`<tr><td>${m.week}</td><td>${esc(fmtDate(m.date))}</td><td>${esc(m.time)}</td><td>${m.group}</td><td>${esc(m.p1)}</td><td>${esc(m.p2)}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderGroups(){
  $("groupsGrid").innerHTML="ABCDEFG".split("").map(g=>`<div class="group-card"><h3>Group ${g}</h3>${state.groups.filter(x=>x.group===g).map(p=>`<div class="player-row"><span>${esc(p.player)}</span><span class="role">${esc(p.role)}</span></div>`).join("")}</div>`).join("");
}
function renderStandings(){
  const el=$("standingsGrid");
  if(!state.standings.length){
    el.innerHTML='<p class="muted-empty">Waiting for live standings data.</p>';$("wildcardTable").innerHTML="";$("qualifiers").innerHTML="";return;
  }
  const e=eligibleByGroup();
  el.innerHTML="ABCDEFG".split("").map(g=>{
    const a=state.standings.filter(x=>x.group===g).sort(compareRank),q=new Set((e[g]||[]).slice(0,2).map(x=>x.player));
    return `<div class="group-standing"><div class="group-title">Group ${g}</div><div class="table-wrap"><table><thead><tr><th>#</th><th>Player</th><th>W</th><th>L</th><th>P</th><th>Win%</th><th>Set%</th></tr></thead><tbody>${a.map((x,i)=>`<tr class="${q.has(x.player)?"rank-auto":""}"><td>${i+1}</td><td>${esc(x.player)} ${q.has(x.player)?'<span class="badge qual">Q</span>':""} ${x.matches>0&&x.matches<3?'<span class="badge ineligible">ineligible</span>':""}</td><td>${x.wins}</td><td>${x.losses}</td><td>${x.matches}</td><td>${pct(x.winRate)}</td><td>${pct(x.setRatio)}</td></tr>`).join("")}</tbody></table></div></div>`;
  }).join("");
  const wc=wildcards();
  $("wildcardTable").innerHTML=`<div class="table-wrap"><table><thead><tr><th>#</th><th>Group</th><th>Player</th><th>W</th><th>P</th><th>Win%</th><th>Set%</th><th>PD</th></tr></thead><tbody>${wc.map((x,i)=>`<tr class="${i<2?"rank-wild":""}"><td>${i+1}</td><td>${x.group}</td><td>${esc(x.player)}</td><td>${x.wins}</td><td>${x.matches}</td><td>${pct(x.winRate)}</td><td>${pct(x.setRatio)}</td><td>${x.pointDiff}</td></tr>`).join("")}</tbody></table></div>`;
  const q=[];for(const g of "ABCDEFG"){if(e[g]?.[0])q.push([g+"1",e[g][0].player]);if(e[g]?.[1])q.push([g+"2",e[g][1].player])}if(wc[0])q.push(["WC1",wc[0].player]);if(wc[1])q.push(["WC2",wc[1].player]);
  $("qualifiers").innerHTML=`<div class="qual-list">${q.map(([s,p])=>`<div class="qual-item"><strong>${s}</strong> • ${esc(p)}</div>`).join("")}</div>`;
}
function renderAll(){renderHome();renderSchedule();renderGroups();renderStandings()}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".tab,.view").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");$(b.dataset.view).classList.add("active");
}));
$("homePlayerSearch").addEventListener("input",renderMyMatches);
$("scheduleSearch").addEventListener("input",renderSchedule);
$("groupFilter").addEventListener("change",renderSchedule);
$("weekFilter").addEventListener("change",renderSchedule);
$("refreshBtn").addEventListener("click",refreshData);
refreshData();
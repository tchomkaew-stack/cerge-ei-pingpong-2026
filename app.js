const SHEET_ID="1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI";
const state={groups:[],schedule:[],results:[],standings:[],announcements:[]};
const FALLBACK_ANNOUNCEMENTS=[{
  id:"schedule-2026-11-03-opening-day",
  title:"Schedule update — Tue, 3 Nov",
  message:"Several match times for the opening day have changed. Please check your updated match time in the Schedule.",
  link:"schedule",
  start:"2026-10-31T00:00:00+01:00",
  expiry:"2026-11-03T18:30:00+01:00"
}];
const SEEN_NOTICES_KEY="cerge_pingpong_seen_announcements_v1";
const FALLBACK_SCHEDULE=`1|2026-11-03|09:00|G|Arman Kazemi|Duy Minh Do
1|2026-11-03|10:00|C|Marek Kapička|Caner Kilic
1|2026-11-03|11:00|A|Stephanie Ettmeier|Nazar Rudyi
1|2026-11-03|12:00|E|Gayane Baghumyan|Shafin Shabir
1|2026-11-03|13:00|F|Tomáš Pavela|Winnie Njoroge
1|2026-11-03|16:00|B|Ctirad Slavik|Filip Galla
1|2026-11-03|17:00|A|Stephanie Halamek|Morteza Nasiri
1|2026-11-04|09:00|B|Jonas Tomkin|Filipa Osorio
1|2026-11-04|10:00|F|Filip Matejka|Saba Khizanishvili
1|2026-11-04|11:00|G|Maxi Guennewig|José Gómez
1|2026-11-04|12:00|B|Davit Asatryan|Camilo Gomez
1|2026-11-04|13:00|D|Michal Bauer|Farhang Shirkhani
1|2026-11-04|16:00|C|František Ježek|Andrej Kameništiak
1|2026-11-04|17:00|E|Filip Pertold|Matous Vodenka
1|2026-11-05|09:00|D|Artur Tymoshenko|Filip Bobek
1|2026-11-05|10:00|A|Shehzada G. Abbas|Jakub Šichta
1|2026-11-05|11:00|E|Yaroslav Korobka|Tomas Haufer
1|2026-11-05|12:00|D|David Mora|Martina Jakubův
1|2026-11-05|13:00|G|Julie Chytilová|Václav Jeřábek
1|2026-11-05|16:00|C|Michael Schulz|Ella Sargsyan
1|2026-11-05|17:00|F|Tomáš Konečný|Jan Leher
2|2026-11-09|09:00|F|Tomáš Pavela|Tomáš Konečný
2|2026-11-09|10:00|G|José Gómez|Václav Jeřábek
2|2026-11-09|11:00|B|Ctirad Slavik|Camilo Gomez
2|2026-11-09|12:00|A|Shehzada G. Abbas|Stephanie Halamek
2|2026-11-09|13:00|C|Michael Schulz|František Ježek
2|2026-11-09|16:00|G|Maxi Guennewig|Duy Minh Do
2|2026-11-09|17:00|E|Filip Pertold|Tomas Haufer
2|2026-11-10|09:00|D|Farhang Shirkhani|Filip Bobek
2|2026-11-10|10:00|C|Marek Kapička|Ella Sargsyan
2|2026-11-10|11:00|F|Filip Matejka|Winnie Njoroge
2|2026-11-10|12:00|C|Caner Kilic|Andrej Kameništiak
2|2026-11-10|13:00|G|Arman Kazemi|Julie Chytilová
2|2026-11-10|16:00|A|Nazar Rudyi|Morteza Nasiri
2|2026-11-10|17:00|B|Davit Asatryan|Jonas Tomkin
2|2026-11-11|09:00|F|Saba Khizanishvili|Jan Leher
2|2026-11-11|10:00|E|Matous Vodenka|Shafin Shabir
2|2026-11-11|11:00|E|Yaroslav Korobka|Gayane Baghumyan
2|2026-11-11|12:00|D|David Mora|Artur Tymoshenko
2|2026-11-11|13:00|B|Filip Galla|Filipa Osorio
2|2026-11-11|16:00|D|Michal Bauer|Martina Jakubův
2|2026-11-11|17:00|A|Stephanie Ettmeier|Jakub Šichta
3|2026-11-16|09:00|D|Michal Bauer|Filip Bobek
3|2026-11-16|10:00|C|Caner Kilic|Michael Schulz
3|2026-11-16|11:00|E|Tomas Haufer|Gayane Baghumyan
3|2026-11-16|12:00|C|Marek Kapička|Andrej Kameništiak
3|2026-11-16|13:00|F|Winnie Njoroge|Tomáš Konečný
3|2026-11-16|16:00|G|José Gómez|Arman Kazemi
3|2026-11-16|17:00|D|Martina Jakubův|Artur Tymoshenko
3|2026-11-18|09:00|E|Filip Pertold|Shafin Shabir
3|2026-11-18|10:00|B|Ctirad Slavik|Filipa Osorio
3|2026-11-18|11:00|C|Ella Sargsyan|František Ježek
3|2026-11-18|12:00|G|Maxi Guennewig|Václav Jeřábek
3|2026-11-18|13:00|D|Farhang Shirkhani|David Mora
3|2026-11-18|16:00|A|Nazar Rudyi|Shehzada G. Abbas
3|2026-11-18|17:00|A|Jakub Šichta|Stephanie Halamek
3|2026-11-19|09:00|F|Filip Matejka|Jan Leher
3|2026-11-19|10:00|E|Matous Vodenka|Yaroslav Korobka
3|2026-11-19|11:00|A|Stephanie Ettmeier|Morteza Nasiri
3|2026-11-19|12:00|B|Filip Galla|Davit Asatryan
3|2026-11-19|13:00|B|Camilo Gomez|Jonas Tomkin
3|2026-11-19|16:00|G|Duy Minh Do|Julie Chytilová
3|2026-11-19|17:00|F|Saba Khizanishvili|Tomáš Pavela
4|2026-11-23|09:00|D|Michal Bauer|Artur Tymoshenko
4|2026-11-23|10:00|D|Martina Jakubův|Farhang Shirkhani
4|2026-11-23|11:00|A|Stephanie Ettmeier|Stephanie Halamek
4|2026-11-23|12:00|G|Duy Minh Do|José Gómez
4|2026-11-23|13:00|F|Winnie Njoroge|Saba Khizanishvili
4|2026-11-23|16:00|E|Tomas Haufer|Matous Vodenka
4|2026-11-23|17:00|C|Andrej Kameništiak|Michael Schulz
4|2026-11-24|09:00|C|Ella Sargsyan|Caner Kilic
4|2026-11-24|10:00|G|Maxi Guennewig|Julie Chytilová
4|2026-11-24|11:00|B|Camilo Gomez|Filip Galla
4|2026-11-24|12:00|D|Filip Bobek|David Mora
4|2026-11-24|13:00|C|Marek Kapička|František Ježek
4|2026-11-24|16:00|E|Shafin Shabir|Yaroslav Korobka
4|2026-11-24|17:00|F|Jan Leher|Tomáš Pavela
4|2026-11-25|09:00|B|Ctirad Slavik|Jonas Tomkin
4|2026-11-25|10:00|B|Filipa Osorio|Davit Asatryan
4|2026-11-25|11:00|A|Morteza Nasiri|Shehzada G. Abbas
4|2026-11-25|12:00|G|Václav Jeřábek|Arman Kazemi
4|2026-11-25|13:00|E|Filip Pertold|Gayane Baghumyan
4|2026-11-25|16:00|F|Filip Matejka|Tomáš Konečný
4|2026-11-25|17:00|A|Jakub Šichta|Nazar Rudyi
5|2026-11-30|09:00|C|Marek Kapička|Michael Schulz
5|2026-11-30|10:00|E|Shafin Shabir|Tomas Haufer
5|2026-11-30|11:00|C|František Ježek|Caner Kilic
5|2026-11-30|12:00|E|Filip Pertold|Yaroslav Korobka
5|2026-11-30|13:00|D|Artur Tymoshenko|Farhang Shirkhani
5|2026-11-30|16:00|D|Michal Bauer|David Mora
5|2026-11-30|17:00|D|Filip Bobek|Martina Jakubův
5|2026-12-01|09:00|A|Stephanie Halamek|Nazar Rudyi
5|2026-12-01|10:00|A|Morteza Nasiri|Jakub Šichta
5|2026-12-01|11:00|B|Filipa Osorio|Camilo Gomez
5|2026-12-01|12:00|B|Jonas Tomkin|Filip Galla
5|2026-12-01|13:00|A|Stephanie Ettmeier|Shehzada G. Abbas
5|2026-12-01|16:00|E|Gayane Baghumyan|Matous Vodenka
5|2026-12-01|17:00|F|Filip Matejka|Tomáš Pavela
5|2026-12-02|09:00|G|Václav Jeřábek|Duy Minh Do
5|2026-12-02|10:00|F|Jan Leher|Winnie Njoroge
5|2026-12-02|11:00|F|Tomáš Konečný|Saba Khizanishvili
5|2026-12-02|12:00|G|Julie Chytilová|José Gómez
5|2026-12-02|13:00|G|Maxi Guennewig|Arman Kazemi
5|2026-12-02|16:00|C|Andrej Kameništiak|Ella Sargsyan
5|2026-12-02|17:00|B|Ctirad Slavik|Davit Asatryan`.trim().split("\n").map(line=>{
  const [week,date,time,group,p1,p2]=line.split("|");
  return {week:Number(week),date,time,group,p1,p2};
});

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
  const playerGroup=new Map(state.groups.map(x=>[x.player,x.group]));
  const players=[...playerGroup.keys()].sort((a,b)=>b.length-a.length);

  const normalizeWeek=s=>{
    const m=norm(s).match(/^(?:week\s*)?([1-5])$/i);
    return m?Number(m[1]):0;
  };
  const normalizeTime=s=>{
    const v=norm(s);
    const m=v.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/i);
    if(!m)return "";
    let h=Number(m[1]),min=m[2],ap=(m[3]||"").toLowerCase();
    if(ap==="pm"&&h<12)h+=12;
    if(ap==="am"&&h===12)h=0;
    return String(h).padStart(2,"0")+":"+min;
  };
  const normalizeDate=s=>{
    const v=norm(s);
    let m=v.match(/^(2026)[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
    if(m)return `${m[1]}-${String(Number(m[2])).padStart(2,"0")}-${String(Number(m[3])).padStart(2,"0")}`;
    m=v.match(/^(\d{1,2})[.](\d{1,2})[.](2026)$/);
    if(m)return `2026-${String(Number(m[2])).padStart(2,"0")}-${String(Number(m[1])).padStart(2,"0")}`;
    m=v.match(/^(\d{1,2})\/(\d{1,2})\/(2026)$/);
    if(m){
      const a=Number(m[1]),b=Number(m[2]);
      // Tournament is in Nov-Dec; infer which component is the month.
      if(a===11||a===12)return `2026-${String(a).padStart(2,"0")}-${String(b).padStart(2,"0")}`;
      if(b===11||b===12)return `2026-${String(b).padStart(2,"0")}-${String(a).padStart(2,"0")}`;
    }
    const d=new Date(v);
    if(!Number.isNaN(d.getTime())&&d.getFullYear()===2026){
      return `2026-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    }
    return "";
  };
  const weekFromDate=iso=>{
    if(!iso)return 0;
    const md=iso.slice(5);
    if(["11-03","11-04","11-05"].includes(md))return 1;
    if(["11-09","11-10","11-11"].includes(md))return 2;
    if(["11-16","11-18","11-19"].includes(md))return 3;
    if(["11-23","11-24","11-25"].includes(md))return 4;
    if(["11-30","12-01","12-02"].includes(md))return 5;
    return 0;
  };

  const out=[];
  for(const r of rows){
    const cells=r.map(norm).filter(Boolean);
    if(!cells.length)continue;

    const found=[];
    for(const c of cells){
      if(playerGroup.has(c)&&!found.includes(c))found.push(c);
    }
    if(found.length<2)continue;

    // A valid match must contain two players from the same live group.
    let p1="",p2="",group="";
    outer: for(let i=0;i<found.length;i++){
      for(let j=i+1;j<found.length;j++){
        const g1=playerGroup.get(found[i]),g2=playerGroup.get(found[j]);
        if(g1&&g1===g2){p1=found[i];p2=found[j];group=g1;break outer}
      }
    }
    if(!p1||!p2)continue;

    let date="",time="",week=0;
    for(const c of cells){
      if(!date)date=normalizeDate(c);
      if(!time)time=normalizeTime(c);
      if(!week)week=normalizeWeek(c);
    }
    if(!week)week=weekFromDate(date);

    out.push({week,date,time,group,p1,p2});
  }

  // Deduplicate in case the visualization response repeats a row.
  const seen=new Set();
  return out.filter(m=>{
    const key=[m.week,m.date,m.time,m.group,m.p1,m.p2].join("|");
    if(seen.has(key))return false;
    seen.add(key);return true;
  });
}
function parseResults(rows){
  const h=headerIndex(rows,r=>norm(r[0]).toLowerCase()=="week"&&norm(r[11]).toLowerCase()=="winner");
  if(h<0)return[];
  return rows.slice(h+1).filter(r=>norm(r[4])&&norm(r[5])&&norm(r[11]))
    .map(r=>({
      date:norm(r[1]),
      group:norm(r[3]),
      p1:norm(r[4]),
      p2:norm(r[5]),
      scores:[6,7,8,9,10].map(i=>norm(r[i])).filter(Boolean),
      winner:norm(r[11]),
      setScore:norm(r[12]),
      forfeit:norm(r[13]).toUpperCase()
    }));
}
function parseStandings(rows){
  const h=headerIndex(rows,r=>norm(r[0]).toLowerCase()=="group"&&norm(r[1]).toLowerCase()=="player"&&norm(r[2]).toLowerCase()=="wins");
  if(h<0)return[];
  return rows.slice(h+1).filter(r=>/^[A-G]$/.test(norm(r[0]))&&norm(r[1]))
    .map(r=>({group:norm(r[0]),player:norm(r[1]),wins:num(r[2]),losses:num(r[3]),matches:num(r[7]),winRate:r[8]===""?"":num(r[8]),setRatio:r[10]===""?"":num(r[10]),pointDiff:r[11]===""?"":num(r[11])}));
}
function parseAnnouncements(rows){
  if(!rows?.length)return[];
  const header=rows[0].map(x=>norm(x).toLowerCase());
  const col=(...names)=>header.findIndex(h=>names.includes(h));
  const iId=col("id");
  const iTitle=col("title");
  const iMessage=col("message","text");
  const iLink=col("link","target");
  const iStart=col("start","start date","start datetime");
  const iExpiry=col("expiry","expires","end","end date","end datetime");
  if(iTitle<0||iMessage<0)return[];
  return rows.slice(1).map((r,idx)=>({
    id:norm(iId>=0?r[iId]:"")||("notice-"+idx+"-"+norm(r[iTitle]).toLowerCase().replace(/[^a-z0-9]+/g,"-")),
    title:norm(r[iTitle]),
    message:norm(r[iMessage]),
    link:norm(iLink>=0?r[iLink]:""),
    start:norm(iStart>=0?r[iStart]:""),
    expiry:norm(iExpiry>=0?r[iExpiry]:"")
  })).filter(x=>x.title&&x.message);
}
function noticeTime(v){
  if(!v)return null;
  const d=new Date(v);
  return Number.isNaN(d.getTime())?null:d;
}
function activeAnnouncements(){
  const now=new Date();
  return state.announcements.filter(a=>{
    const s=noticeTime(a.start),e=noticeTime(a.expiry);
    return (!s||now>=s)&&(!e||now<=e);
  });
}
function getSeenNotices(){
  try{
    const value=JSON.parse(localStorage.getItem(SEEN_NOTICES_KEY)||"[]");
    return new Set(Array.isArray(value)?value:[]);
  }catch{return new Set()}
}
function saveSeenNotices(set){
  try{localStorage.setItem(SEEN_NOTICES_KEY,JSON.stringify([...set]))}catch{}
}
function noticeExpiryLabel(v){
  const d=noticeTime(v);
  if(!d)return "";
  return "Until "+new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(d);
}
function renderNotifications(){
  const btn=$("notificationBtn"),list=$("notificationList"),count=$("notificationCount");
  if(!btn||!list)return;
  const active=activeAnnouncements();
  const seen=getSeenNotices();
  const unseen=active.filter(a=>!seen.has(a.id));
  btn.classList.toggle("has-unseen",unseen.length>0);
  count.textContent=unseen.length?unseen.length+" unread tournament notification"+(unseen.length===1?"":"s"):"No unread tournament notifications";
  list.innerHTML=active.length?active.map(a=>{
    const internal=["home","schedule","standings","groups","rules"].includes(a.link.toLowerCase());
    const action=a.link?(internal
      ?`<button class="notification-link" type="button" data-notice-view="${esc(a.link.toLowerCase())}">View ${esc(a.link.charAt(0).toUpperCase()+a.link.slice(1).toLowerCase())} →</button>`
      :`<a class="notification-link" href="${esc(a.link)}" target="_blank" rel="noopener noreferrer">Open update →</a>`):"";
    return `<article class="notification-item">
      <div class="notification-item-title">${esc(a.title)}</div>
      <p>${esc(a.message)}</p>
      ${a.expiry?`<span class="notification-time">${esc(noticeExpiryLabel(a.expiry))}</span>`:""}
      ${action}
    </article>`;
  }).join(""):'<p class="notification-empty">No active updates right now.</p>';
}
function openView(view){
  const tab=document.querySelector('.tab[data-view="'+view+'"]');
  const target=$(view);
  if(!tab||!target)return;
  document.querySelectorAll(".tab,.view").forEach(x=>x.classList.remove("active"));
  tab.classList.add("active");target.classList.add("active");
  window.scrollTo({top:document.querySelector(".tabs")?.offsetTop||0,behavior:"smooth"});
}
function openNotifications(){
  const panel=$("notificationPanel"),btn=$("notificationBtn");
  if(!panel||!btn)return;
  panel.hidden=false;
  btn.setAttribute("aria-expanded","true");
  const seen=getSeenNotices();
  activeAnnouncements().forEach(a=>seen.add(a.id));
  saveSeenNotices(seen);
  renderNotifications();
}
function closeNotifications(){
  const panel=$("notificationPanel"),btn=$("notificationBtn");
  if(panel)panel.hidden=true;
  if(btn)btn.setAttribute("aria-expanded","false");
}
function scorePair(s){
  const m=norm(s).match(/^(\d+)\s*[-–:]\s*(\d+)$/);
  return m?[Number(m[1]),Number(m[2])]:null;
}
function deriveStandings(){
  const byPlayer=new Map(
    state.groups.map(p=>[p.player,{
      group:p.group,player:p.player,wins:0,losses:0,matches:0,
      setsWon:0,setsLost:0,pointsFor:0,pointsAgainst:0,
      winRate:0,setRatio:0,pointDiff:-999
    }])
  );

  for(const r of state.results){
    const a=byPlayer.get(r.p1),b=byPlayer.get(r.p2);
    if(!a||!b)continue;

    a.matches++;b.matches++;
    if(r.winner===r.p1){a.wins++;b.losses++}
    else if(r.winner===r.p2){b.wins++;a.losses++}

    if(r.forfeit!=="Y"){
      for(const raw of r.scores||[]){
        const pair=scorePair(raw);
        if(!pair)continue;
        const [x,y]=pair;
        a.pointsFor+=x;a.pointsAgainst+=y;
        b.pointsFor+=y;b.pointsAgainst+=x;
        if(x>y){a.setsWon++;b.setsLost++}
        else if(y>x){b.setsWon++;a.setsLost++}
      }
    }
  }

  for(const x of byPlayer.values()){
    x.winRate=x.matches?x.wins/x.matches:0;
    const totalSets=x.setsWon+x.setsLost;
    x.setRatio=totalSets?x.setsWon/totalSets:0;
    x.pointDiff=(x.pointsFor||x.pointsAgainst)?x.pointsFor-x.pointsAgainst:-999;
  }
  return [...byPlayer.values()];
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
function matchCard(m){return `<div class="match-card"><div class="match-meta">${esc(fmtDate(m.date))} • ${esc(m.time)} • Group ${m.group} • Week ${m.week}</div><div class="match-main"><span>${esc(m.p1)}</span><b>vs</b><span>${esc(m.p2)}</span></div></div>`}

async function refreshData(){
  const status=$("liveStatus");
  const errBox=$("liveError");
  status.textContent="Connecting to live sheet…";status.className="status-pill";
  if(errBox){errBox.style.display="none";errBox.textContent="";}

  const names=["Groups","Schedule","Results recording","Standing"];
  const loaded={};
  const errors=[];
  let announcementsLoaded=false;

  for(const name of names){
    try{ loaded[name]=await fetchSheet(name); }
    catch(e){ errors.push(e.message||String(e)); }
  }
  try{
    loaded["Announcements"]=await fetchSheet("Announcements");
    announcementsLoaded=true;
  }catch{}

  if(loaded["Groups"]) state.groups=parseGroups(loaded["Groups"]);
  let scheduleFallbackUsed=false;
  if(loaded["Schedule"]) state.schedule=parseSchedule(loaded["Schedule"]);
  if(!state.schedule.length){
    state.schedule=FALLBACK_SCHEDULE;
    scheduleFallbackUsed=true;
  }
  if(loaded["Results recording"]) state.results=parseResults(loaded["Results recording"]);
  const sheetStandings=loaded["Standing"]?parseStandings(loaded["Standing"]):[];
  state.standings=state.groups.length?deriveStandings():sheetStandings;
  state.announcements=announcementsLoaded?parseAnnouncements(loaded["Announcements"]):FALLBACK_ANNOUNCEMENTS;

  const coreOk=state.groups.length>0 && state.schedule.length>0;
  if(coreOk && errors.length===0 && !scheduleFallbackUsed){
    status.textContent="Live updates";
    status.className="status-pill live";
    status.title="Groups "+state.groups.length+" • Schedule "+state.schedule.length+" • Results "+state.results.length+" • Standings "+state.standings.length;
  }else if(coreOk && scheduleFallbackUsed && errors.length===0){
    status.textContent="Live updates";
    status.className="status-pill live";
    status.title="Groups live • Schedule cached from audited tournament workbook • Results/standings live when available";
    if(errBox){errBox.style.display="none";errBox.textContent="";}
  }else if(coreOk){
    status.textContent="Live updates limited";
    status.className="status-pill fallback";
    status.title=errors.join("\n");
    if(errBox){errBox.style.display="block";errBox.textContent=errors.join(" | ");}
  }else{
    status.textContent="Live data unavailable";
    status.className="status-pill fallback";
    status.title=(errors.length?errors.join("\n"):"Parsed Groups "+state.groups.length+", Schedule "+state.schedule.length);
    if(errBox){errBox.style.display="block";errBox.textContent=(errors.length?errors.join(" | "):"Parsed Groups "+state.groups.length+", Schedule "+state.schedule.length);}
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

function renderChallenges(){
  const cards=[
    {
      tag:"PERFECT GROUP STAGE",
      name:"Ctirad Slavik",
      stat:"6–0 · 100%",
      text:"Ctirad went unbeaten in last year’s group stage — and did not drop a single game (12–0). Who will be the first to take one this season?"
    },
    {
      tag:"UNBEATEN RETURNER",
      name:"Arman Kazemi",
      stat:"6–0 · +89",
      text:"Arman also finished last year’s group stage undefeated, with the biggest point differential among this year’s returning players. Can Group G stop the streak?"
    },
    {
      tag:"PERFECT RETURNER",
      name:"Michael Schulz",
      stat:"6–0 · 100%",
      text:"Michael swept all six group-stage matches last season and returns in Group C. Who will hand him his first group-stage loss?"
    },
    {
      tag:"PERFECT RETURNER",
      name:"Yaroslav Korobka",
      stat:"6–0 · 100%",
      text:"Yaroslav completed another perfect 6–0 group stage last year. This season, Group E gets the challenge."
    },
    {
      tag:"STRONG RETURNER",
      name:"Filip Matejka",
      stat:"5–1 · 83%",
      text:"Filip won five of six group-stage matches last year and posted a +80 point differential — one of the strongest returning records."
    },
    {
      tag:"WELCOME BACK",
      name:"19 returning players",
      stat:"45% return",
      text:"Almost half of this year’s field also played in 2025 — a nice sign that people wanted another season."
    }
  ];
  const el=$("challengeGrid");
  if(!el)return;
  el.innerHTML=cards.map((c,i)=>`<article class="challenge-card ${i<4?"challenge-featured":""}">
    <div class="challenge-top">
      <span class="challenge-tag">${esc(c.tag)}</span>
      <strong class="challenge-stat">${esc(c.stat)}</strong>
    </div>
    <h3>${esc(c.name)}</h3>
    <p>${esc(c.text)}</p>
  </article>`).join("");
}

function renderAll(){renderHome();renderSchedule();renderGroups();renderStandings();renderChallenges();renderNotifications()}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>openView(b.dataset.view)));
$("notificationBtn")?.addEventListener("click",()=>{
  const panel=$("notificationPanel");
  if(panel?.hidden)openNotifications();else closeNotifications();
});
$("notificationClose")?.addEventListener("click",closeNotifications);
$("notificationList")?.addEventListener("click",e=>{
  const target=e.target.closest("[data-notice-view]");
  if(!target)return;
  openView(target.dataset.noticeView);
  closeNotifications();
});
document.addEventListener("click",e=>{
  const panel=$("notificationPanel"),btn=$("notificationBtn");
  if(!panel||panel.hidden||panel.contains(e.target)||btn?.contains(e.target))return;
  closeNotifications();
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeNotifications()});
$("homePlayerSearch").addEventListener("input",renderMyMatches);
$("scheduleSearch").addEventListener("input",renderSchedule);
$("groupFilter").addEventListener("change",renderSchedule);
$("weekFilter").addEventListener("change",renderSchedule);
$("refreshBtn").addEventListener("click",refreshData);
refreshData();
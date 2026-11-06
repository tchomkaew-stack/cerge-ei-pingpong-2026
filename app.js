const SHEET_ID="1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI";
const state={groups:[],schedule:[],results:[],standings:[],announcements:[],knockout:[]};
const FALLBACK_ANNOUNCEMENTS=[{
  id:"group-stage-best-of-five-2026-11-02",
  title:"Rule clarification — group stage is best of 5",
  message:"Group-stage matches are best of five games (first to 3 games), with each game played to 11 points. The Rules page has been corrected.",
  link:"rules",
  start:"2026-11-02T17:20:00+01:00",
  expiry:"2026-11-09T23:59:00+01:00"
},{
  id:"academic-priority-nov-2026",
  title:"Academic weeks ahead",
  message:"Midterm Weeks (2–13 Nov) and DPW/State Doctoral Exams Week (23–27 Nov) are coming up. Please reschedule matches as needed to avoid academic distractions.",
  link:"schedule",
  start:"2026-10-31T00:00:00+01:00",
  expiry:"2026-11-27T23:59:00+01:00"
}];
const SEEN_NOTICES_KEY="cerge_pingpong_seen_announcements_v2";
const LEGACY_SEEN_NOTICES_KEY="cerge_pingpong_seen_announcements_v1";
const FALLBACK_SCHEDULE=`1|2026-11-03|14:30|C|Marek Kapička|Michael Schulz
1|2026-11-03|15:15|B|Ctirad Slavik|Filip Galla
1|2026-11-03|16:00|A|Stephanie Ettmeier|Nazar Rudyi
1|2026-11-03|12:00|E|Gayane Baghumyan|Shafin Shabir
1|2026-11-03|16:45|F|Tomáš Pavela|Winnie Njoroge
1|2026-11-03|17:30|G|Arman Kazemi|Duy Minh Do
1|2026-11-03|18:15|A|Stephanie Halamek|Morteza Nasiri
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
5|2026-11-30|09:00|C|Marek Kapička|Caner Kilic
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

// Keep the tournament usable while Google Sheets is temporarily unreachable.
// The fallback is overwritten by live data as soon as the API responds.
const FALLBACK_GROUPS=[...new Map(FALLBACK_SCHEDULE.flatMap(m=>[
  [m.group+"|"+m.p1,{group:m.group,player:m.p1,role:""}],
  [m.group+"|"+m.p2,{group:m.group,player:m.p2,role:""}]
])).values()];
state.groups=FALLBACK_GROUPS;
state.schedule=[...FALLBACK_SCHEDULE];

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").trim();
const num=v=>{const n=parseFloat(String(v??"").replace("%",""));return Number.isFinite(n)?n:0};
const pct=v=>v===""||v==null?"—":(Number(v)*100).toFixed(0)+"%";
const rateFromSheet=v=>{
  const s=norm(v);
  if(!s)return 0;
  const n=num(s);
  return s.includes("%")?n/100:n>1?n/100:n;
};

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
function sheetKey(value){
  return norm(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
}
function parseResults(rows){
  const h=rows.findIndex(r=>{
    const cols=r.map(sheetKey);
    return cols.includes("winner")&&cols.some(v=>v==="player 1"||v==="player1")
      &&cols.some(v=>v==="player 2"||v==="player2");
  });
  if(h<0)return[];
  const headers=rows[h].map(sheetKey);
  const index=(...xs)=>headers.findIndex(v=>xs.includes(v));
  const p1=index("player 1","player1"),p2=index("player 2","player2"),
    winner=index("winner"),group=index("group"),date=index("date"),
    forfeit=index("forfeit (y/n)","forfeit","forfeit y/n"),
    setScore=index("set score (e.g. 3-1)","set score (e.g. 2-1)","set score","set score (e.g. 3–1)"),
    updated=index("last updated","updated at","recorded at");
  const scoreCols=[1,2,3,4,5].map(n=>headers.findIndex(x=>x==="score set "+n||x==="set "+n));
  return rows.slice(h+1).filter(r=>norm(r[p1])&&norm(r[p2])).map((r,rowIndex)=>{
    const scores=scoreCols.map(i=>i>=0?norm(r[i]):"").filter(Boolean);
    let w=norm(r[winner]);
    // Sheets may contain scores before the winner formula has recalculated.
    if(!w){
      let aw=0,bw=0;
      scores.forEach(s=>{const m=scorePair(s);if(m){if(m[0]>m[1])aw++;else if(m[1]>m[0])bw++;}});
      if(aw>=3)w=norm(r[p1]);
      else if(bw>=3)w=norm(r[p2]);
    }
    return {
      date:date>=0?norm(r[date]):"",updatedAt:updated>=0?norm(r[updated]):"",rowIndex,group:group>=0?norm(r[group]):"",
      p1:norm(r[p1]),p2:norm(r[p2]),scores,
      winner:w,setScore:setScore>=0?norm(r[setScore]):"",
      forfeit:forfeit>=0?norm(r[forfeit]).toUpperCase():""
    };
  }).filter(r=>r.winner && [sheetKey(r.p1),sheetKey(r.p2)].includes(sheetKey(r.winner)));
}
function parseStandings(rows){
  const h=rows.findIndex(r=>{
    const cols=r.map(sheetKey);
    return cols.includes("group")&&cols.includes("player")&&cols.includes("wins");
  });
  if(h<0)return[];
  const cols=rows[h].map(sheetKey);
  const i=(...names)=>cols.findIndex(x=>names.includes(x));
  const g=i("group"),p=i("player"),w=i("wins"),l=i("losses"),m=i("matches played","matches"),
    win=i("win rate","win%"),set=i("set ratio","set%"),pd=i("point diff","point differential");
  return rows.slice(h+1).filter(r=>/^[A-G]$/i.test(norm(r[g]))&&norm(r[p]))
    .map(r=>({
      group:norm(r[g]).toUpperCase(),player:norm(r[p]),wins:num(r[w]),losses:num(r[l]),
      matches:m>=0?num(r[m]):0,
      winRate:win>=0?rateFromSheet(r[win]):0,setRatio:set>=0?rateFromSheet(r[set]):0,
      pointDiff:pd>=0?num(r[pd]):0
    }));
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
// A content revision should be new even when the organizer reuses its sheet ID.
function noticeVersion(a){
  const content=[a.id,a.title,a.message,a.link,a.start,a.expiry].join("\u001f");
  let hash=2166136261;
  for(let i=0;i<content.length;i++){
    hash^=content.charCodeAt(i);
    hash=Math.imul(hash,16777619);
  }
  return a.id+":"+((hash>>>0).toString(36));
}
function getSeenNotices(){
  try{
    const saved=localStorage.getItem(SEEN_NOTICES_KEY);
    if(saved!==null){
      const parsed=JSON.parse(saved);
      return new Set(Array.isArray(parsed)?parsed:[]);
    }
    // Migrate existing read notices once, without marking edited notices read forever.
    const legacy=JSON.parse(localStorage.getItem(LEGACY_SEEN_NOTICES_KEY)||"[]");
    const oldIds=new Set(Array.isArray(legacy)?legacy:[]);
    const migrated=new Set(activeAnnouncements().filter(a=>oldIds.has(a.id)).map(noticeVersion));
    saveSeenNotices(migrated);
    return migrated;
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
let openedNotificationHighlights=new Set();
function renderNotifications(){
  const btn=$("notificationBtn"),list=$("notificationList"),count=$("notificationCount");
  if(!btn||!list)return;
  const active=activeAnnouncements();
  const seen=getSeenNotices();
  const unseen=active.filter(a=>!seen.has(noticeVersion(a)));
  const panel=$("notificationPanel");
  const highlights=panel&&!panel.hidden?openedNotificationHighlights:new Set(unseen.map(noticeVersion));
  btn.classList.toggle("has-unseen",unseen.length>0);
  btn.setAttribute("aria-label",unseen.length
    ?unseen.length+" unread tournament "+(unseen.length===1?"notification":"notifications")
    :"Tournament notifications");
  count.textContent=unseen.length
    ?unseen.length+" new tournament "+(unseen.length===1?"notification":"notifications")
    :active.length?active.length+" tournament "+(active.length===1?"update":"updates")+", all read"
      :"No active tournament notifications";
  list.innerHTML=active.length?active.map(a=>{
    const isNew=highlights.has(noticeVersion(a))||(!seen.has(noticeVersion(a))&&panel&&!panel.hidden);
    const internal=["home","schedule","results","standings","groups","rules","knockout"].includes(a.link.toLowerCase());
    // Only allow ordinary web URLs from the announcements sheet.
    const external=/^https?:\/\//i.test(a.link);
    const action=a.link?(internal
      ?'<button class="notification-link" type="button" data-notice-view="'+esc(a.link.toLowerCase())+'">View '+esc(a.link.charAt(0).toUpperCase()+a.link.slice(1).toLowerCase())+' →</button>'
      :external?'<a class="notification-link" href="'+esc(a.link)+'" target="_blank" rel="noopener noreferrer">Open update →</a>':""):"";
    return '<article class="notification-item'+(isNew?' notification-item-new':'')+'">'+
      '<div class="notification-item-heading"><div class="notification-item-title">'+esc(a.title)+'</div>'+
      (isNew?'<span class="notification-new-label">New</span>':"")+'</div>'+
      '<p>'+esc(a.message)+'</p>'+
      (a.expiry?'<span class="notification-time">'+esc(noticeExpiryLabel(a.expiry))+'</span>':"")+
      action+'</article>';
  }).join(""):'<p class="notification-empty">No active updates right now.</p>';
}
function openView(view){
  const target=$(view);
  if(!target)return;
  document.querySelectorAll(".tab,.view,[data-view='record-score'],[data-view='change-schedule']").forEach(x=>x.classList.remove("active"));
  const tab=document.querySelector('.tab[data-view="'+view+'"]');
  if(tab)tab.classList.add("active");
  if(view==="record-score"||view==="change-schedule"){
    document.querySelectorAll('[data-view="'+view+'"]').forEach(x=>x.classList.add("active"));
  }
  target.classList.add("active");
  document.querySelectorAll(".tab").forEach(button=>{
    if(button.dataset.view===view)button.setAttribute("aria-current","page");
    else button.removeAttribute("aria-current");
  });
  closeNotifications();
  window.scrollTo({top:document.querySelector(".tabs")?.offsetTop||0,behavior:"smooth"});
}
function openNotifications(){
  const panel=$("notificationPanel"),btn=$("notificationBtn");
  if(!panel||!btn)return;
  const seen=getSeenNotices();
  const active=activeAnnouncements();
  openedNotificationHighlights=new Set(active.filter(a=>!seen.has(noticeVersion(a))).map(noticeVersion));
  panel.hidden=false;
  btn.setAttribute("aria-expanded","true");
  active.forEach(a=>seen.add(noticeVersion(a)));
  saveSeenNotices(seen);
  renderNotifications();
}
function closeNotifications(){
  const panel=$("notificationPanel"),btn=$("notificationBtn");
  if(panel)panel.hidden=true;
  if(btn)btn.setAttribute("aria-expanded","false");
  openedNotificationHighlights.clear();
}
function scorePair(s){
  const m=norm(s).match(/^(\d+)\s*[-–:]\s*(\d+)$/);
  return m?[Number(m[1]),Number(m[2])]:null;
}
function deriveStandings(){
  const byPlayer=new Map(state.groups.map(p=>[sheetKey(p.player),{
    group:p.group,player:p.player,wins:0,losses:0,matches:0,
    setsWon:0,setsLost:0,pointsFor:0,pointsAgainst:0,
    winRate:0,setRatio:0,pointDiff:-999
  }]));
  for(const r of state.results){
    const a=byPlayer.get(sheetKey(r.p1)),b=byPlayer.get(sheetKey(r.p2));
    if(!a||!b||a===b)continue;
    const winner=sheetKey(r.winner);
    if(winner!==sheetKey(r.p1)&&winner!==sheetKey(r.p2))continue;
    a.matches++;b.matches++;
    if(winner===sheetKey(r.p1)){a.wins++;b.losses++}
    else{b.wins++;a.losses++}
    if(r.forfeit!=="Y"){
      for(const s of r.scores){
        const pair=scorePair(s);
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
    const sets=x.setsWon+x.setsLost;
    x.setRatio=sets?x.setsWon/sets:0;
    x.pointDiff=x.pointsFor+x.pointsAgainst?x.pointsFor-x.pointsAgainst:-999;
  }
  return [...byPlayer.values()];
}
function compareRank(a,b){
  return b.wins-a.wins||b.winRate-a.winRate||b.setRatio-a.setRatio||b.pointDiff-a.pointDiff;
}
function unresolvedTie(a,b){return Boolean(a&&b&&compareRank(a,b)===0)}
function qualificationStatus(player,eligible,wc){
  const rank=eligible.findIndex(x=>sheetKey(x.player)===sheetKey(player.player));
  if(rank<0)return "";
  if(rank===0)return unresolvedTie(eligible[0],eligible[2])?"Tie — decision pending":"Automatic position";
  if(rank===1)return unresolvedTie(eligible[1],eligible[2])?"Tie — decision pending":"Automatic position";
  if(rank===2&&unresolvedTie(eligible[1],eligible[2]))return "Tie — decision pending";
  const wi=wc.findIndex(x=>sheetKey(x.player)===sheetKey(player.player));
  if(wi>=0&&wi<2)return unresolvedTie(wc[1],wc[2])?"Tie — decision pending":"Wildcard position";
  if(wi===2&&unresolvedTie(wc[1],wc[2]))return "Tie — decision pending";
  return "";
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
function pairKey(g,a,b){return sheetKey(g)+":"+[sheetKey(a),sheetKey(b)].sort().join("|")}
// These are verified 2025 encounters. Show them only on unplayed 2026 fixtures.
const FEATURED_2025_REMATCHES=[
  {group:"E",players:["Shafin Shabir","Tomas Haufer"],story:"2025: Shafin came back from 1–2 down to win 3–2.",note:"Time to be confirmed — Shafin requested a start after 15:00."},
  {group:"E",players:["Filip Pertold","Gayane Baghumyan"],story:"2025: Filip won a five-game thriller, 3–2 (11–6 in the decider)."},
  {group:"G",players:["Václav Jeřábek","Arman Kazemi"],story:"2025: Arman lost the opening game, then fought back to win 3–1."}
];
function rematch2025(m){
  // A fixture can be played early or rescheduled. A recorded result always wins
  // over the scheduled date; past dates without a result are not promoted.
  if(state.results.some(r=>sheetKey(r.group)===sheetKey(m.group)
    && [sheetKey(r.p1),sheetKey(r.p2)].sort().join("|")===[sheetKey(m.p1),sheetKey(m.p2)].sort().join("|")))return null;
  if(matchTime(m)<Date.now())return null;
  const pair=[sheetKey(m.p1),sheetKey(m.p2)].sort().join("|");
  return FEATURED_2025_REMATCHES.find(x=>sheetKey(x.group)===sheetKey(m.group)
    && x.players.map(sheetKey).sort().join("|")===pair)||null;
}
function rematchMarkup(m,compact=false){
  const feature=rematch2025(m);
  if(!feature)return "";
  return '<div class="rematch-history'+(compact?' rematch-history-compact':'')+'">'+
    '<span class="rematch-tag">2025 rematch</span>'+
    '<span class="rematch-story">'+esc(feature.story)+'</span>'+
    (feature.note?'<span class="rematch-time-note">'+esc(feature.note)+'</span>':"")+
    '</div>';
}
function matchCard(m){
  return `<div class="match-card"><div class="match-meta">${esc(fmtDate(m.date))} • ${esc(m.time)} • Group ${m.group} • Week ${m.week}</div><div class="match-main"><span>${esc(m.p1)}</span><b>vs</b><span>${esc(m.p2)}</span></div>${rematchMarkup(m)}</div>`;
}


function resultForMatch(m){return state.results.find(r=>pairKey(r.group,r.p1,r.p2)===pairKey(m.group,m.p1,m.p2))}
function matchTime(m){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(m.date||"")||!/^\d{2}:\d{2}$/.test(m.time||""))return Infinity;
  const [year,month,day]=m.date.split("-").map(Number);
  const [hour,minute]=m.time.split(":").map(Number);
  const utc=Date.UTC(year,month-1,day,hour,minute);
  const zone=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Prague",timeZoneName:"shortOffset"})
    .formatToParts(new Date(utc)).find(x=>x.type==="timeZoneName")?.value||"GMT+1";
  const match=zone.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  const offset=match?(match[1]==="+"?1:-1)*(Number(match[2])*60+Number(match[3]||0)):60;
  return utc-offset*60000;
}
function playerMatchCard(m,player){
  const result=resultForMatch(m);
  const opponent=sheetKey(m.p1)===sheetKey(player)?m.p2:m.p1;
  const when=(m.date?fmtDate(m.date):"Date to confirm")+(m.time?" · "+m.time:" · Time to confirm");
  const isPast=!result&&matchTime(m)<Date.now();
  let outcome="";
  if(result){
    const won=sheetKey(result.winner)===sheetKey(player);
    let score="";
    if(result.forfeit!=="Y"){
      const pair=scorePair(result.setScore);
      if(pair)score=" · "+Math.max(...pair)+"–"+Math.min(...pair);
      else if(result.scores.length){
        let p1=0,p2=0;
        result.scores.forEach(s=>{const pair=scorePair(s);if(pair){if(pair[0]>pair[1])p1++;else if(pair[1]>pair[0])p2++}});
        if(p1||p2)score=" · "+Math.max(p1,p2)+"–"+Math.min(p1,p2);
      }
    }
    outcome='<span class="player-match-outcome '+(won?"won":"lost")+'">'+
      (won?"Won":"Lost")+(result.forfeit==="Y"?" by forfeit":score)+'</span>';
  }
  const status=result?"Completed":isPast?"Time passed · result pending":"Scheduled";
  return '<article class="player-fixture"><div class="player-fixture-main">'+
    '<div class="player-fixture-opponent">vs '+esc(opponent)+'</div>'+
    '<div class="player-fixture-date">'+esc(when)+' · Group '+esc(m.group)+'</div>'+
    '</div><div class="player-fixture-side">'+
    (result?outcome:'<span class="match-status '+(isPast?"pending":"scheduled")+'">'+esc(status)+'</span>')+
    '<button class="mini-action" type="button" data-record-match="'+esc(scoreMatchKey(m))+'">'+
    (result?"Correct result":"Record result")+'</button></div></article>';
}

function renderProgress(){
  const all=[...new Set(state.schedule.map(m=>pairKey(m.group,m.p1,m.p2)))];
  const done=new Set(state.results.map(r=>pairKey(r.group,r.p1,r.p2)));
  const count=all.filter(k=>done.has(k)).length,pctDone=all.length?Math.round(count/all.length*100):0;
  $("progressSummary").textContent=count+" of "+all.length+" matches recorded";
  $("progressPercent").textContent=pctDone+"%";
  $("progressFill").style.width=pctDone+"%";
  $("progressTrack").setAttribute("aria-valuemax",String(all.length||105));
  $("progressTrack").setAttribute("aria-valuenow",String(count));
  $("groupProgress").innerHTML="ABCDEFG".split("").map(g=>{
    const keys=[...new Set(state.schedule.filter(m=>m.group===g).map(m=>pairKey(m.group,m.p1,m.p2)))];
    const n=keys.filter(k=>done.has(k)).length;
    return '<div class="group-progress-item"><div><strong>Group '+g+'</strong><span>'+n+'/'+keys.length+'</span></div>'+
      '<div class="group-progress-track"><div style="width:'+(keys.length?Math.round(n/keys.length*100):0)+'%"></div></div></div>';
  }).join("");
}
function renderPlayerDashboard(players){
  const el=$("playerDashboard");
  if(players.length!==1){el.innerHTML=players.length>1?'<p class="small-note">Multiple players match. Type more of the name for an individual summary.</p>':"";return}
  const player=players[0],matches=state.schedule.filter(m=>m.p1===player||m.p2===player);
  const played=matches.filter(m=>Boolean(resultForMatch(m))).length;
  const standing=state.standings.find(x=>sheetKey(x.player)===sheetKey(player));
  const group=state.groups.find(x=>x.player===player)?.group||matches[0]?.group||"";
  const e=eligibleByGroup(),wc=wildcards();
  const status=played>=3?qualificationStatus({player},e[group]||[],wc):"";
  const qualification=played<3?played+" of 3 matches played toward knockout eligibility":
    status==="Tie — decision pending"?status:
    status==="Automatic position"?"Currently in an automatic qualifying position":
    status==="Wildcard position"?"Currently in a wildcard qualifying position":"Knockout minimum reached · standings still evolving";
  el.innerHTML='<div class="player-summary"><div class="player-summary-head"><div><span class="section-label">YOUR TOURNAMENT</span><h3>'+esc(player)+'</h3><p>Group '+esc(group)+' · '+esc(qualification)+'</p></div>'+
    '<span class="player-match-counter">'+played+'/'+matches.length+' matches</span></div>'+
    '<div class="player-summary-stats"><span><strong>'+(standing?.wins??0)+'</strong> wins</span><span><strong>'+(standing?.losses??0)+'</strong> losses</span>'+
    '<span><strong>'+Math.max(0,matches.length-played)+'</strong> remaining</span><span><strong>'+Math.min(played,3)+'/3</strong> knockout minimum</span></div></div>';
}


function validateScheduleData(schedule,groups){
  const errors=[],players=new Map(groups.map(x=>[sheetKey(x.player),x.group])),unique=new Set();
  if(groups.length!==42||new Set(groups.map(x=>sheetKey(x.player))).size!==42)errors.push("Expected 42 unique players.");
  for(const g of "ABCDEFG")if(groups.filter(x=>x.group===g).length!==6)errors.push("Group "+g+" should contain 6 players.");
  if(schedule.length!==105)errors.push("Expected 105 fixtures, found "+schedule.length+".");
  for(const m of schedule){
    const key=pairKey(m.group,m.p1,m.p2);
    if(unique.has(key))errors.push("Duplicate fixture: "+m.p1+" / "+m.p2);
    unique.add(key);
    if(sheetKey(m.p1)===sheetKey(m.p2)||players.get(sheetKey(m.p1))!==m.group||players.get(sheetKey(m.p2))!==m.group)
      errors.push("Invalid group pairing: "+m.p1+" / "+m.p2);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(m.date||"")||!/^\d{2}:\d{2}$/.test(m.time||""))
      errors.push("Invalid fixture date/time: "+m.p1+" / "+m.p2);
  }
  return errors;
}
function validateResultData(results,schedule){
  // Results recording is an independent source of completed matches. Dates and
  // times may legitimately differ from Schedule after players reschedule.
  // Only compare the group and unordered player pair; never compare timestamps.
  const keys=new Set(schedule.map(m=>pairKey(m.group,m.p1,m.p2))),seen=new Set(),errors=[];
  for(const r of results){
    const key=pairKey(r.group,r.p1,r.p2);
    if(!keys.has(key))errors.push("Result has no fixture: "+r.p1+" / "+r.p2);
    if(seen.has(key))errors.push("Duplicate result: "+r.p1+" / "+r.p2);
    seen.add(key);
    if(![sheetKey(r.p1),sheetKey(r.p2)].includes(sheetKey(r.winner)))errors.push("Invalid winner: "+r.p1+" / "+r.p2);
    if(r.forfeit!=="Y"&&r.scores.length){
      let p1=0,p2=0;
      for(const score of r.scores){
        const pair=scorePair(score);
        if(!pair||Math.max(...pair)<11||Math.abs(pair[0]-pair[1])<2||(Math.max(...pair)>11&&Math.abs(pair[0]-pair[1])!==2))
          errors.push("Invalid game score: "+r.p1+" / "+r.p2);
        if(pair){if(pair[0]>pair[1])p1++;else p2++;}
      }
      if(Math.max(p1,p2)!==3||sheetKey(p1===3?r.p1:r.p2)!==sheetKey(r.winner))
        errors.push("Game wins mismatch: "+r.p1+" / "+r.p2);
    }
  }
  return errors;
}

function parseKnockout(rows){
  const h=rows.findIndex(r=>r.map(sheetKey).includes("round")&&r.map(sheetKey).includes("player 1")&&r.map(sheetKey).includes("player 2"));
  if(h<0)return[];
  const cols=rows[h].map(sheetKey),idx=(...xs)=>cols.findIndex(x=>xs.includes(x));
  const ir=idx("round"),im=idx("match","match number","match #"),ip1=idx("player 1"),ip2=idx("player 2"),iw=idx("winner"),id=idx("date"),it=idx("time");
  const rounds={"r16":"R16","round of 16":"R16","last 16":"R16","quarterfinal":"QF","quarterfinals":"QF","qf":"QF","semifinal":"SF","semifinals":"SF","semi-final":"SF","sf":"SF","final":"F","f":"F"};
  return rows.slice(h+1).map((r,i)=>({
    round:rounds[sheetKey(r[ir])]||"",match:im>=0?Number(norm(r[im])):i+1,
    p1:norm(r[ip1]),p2:norm(r[ip2]),winner:iw>=0?norm(r[iw]):"",
    date:id>=0?norm(r[id]):"",time:it>=0?norm(r[it]):""
  })).filter(x=>x.round&&x.p1&&x.p2);
}
function renderKnockout(){
  const published=state.knockout.length>0;
  $("knockoutTab").hidden=!published;
  $("knockout").hidden=!published;
  if(!published){if($("knockout").classList.contains("active"))openView("home");return}
  const rounds=[["R16","Round of 16",8],["QF","Quarterfinals",4],["SF","Semifinals",2],["F","Final",1]];
  $("knockoutBracket").innerHTML=rounds.map(([key,label,count])=>{
    const matches=state.knockout.filter(x=>x.round===key).sort((a,b)=>a.match-b.match);
    return '<div class="knockout-round"><h3>'+label+'</h3>'+
      Array.from({length:count},(_,i)=>{
        const m=matches[i];
        return '<button type="button" class="bracket-match" '+(m?'data-bracket-round="'+key+'" data-bracket-index="'+i+'"':"disabled")+'>'+
          '<span class="bracket-match-num">Match '+(i+1)+'</span>'+
          '<span class="'+(m&&sheetKey(m.winner)===sheetKey(m.p1)?"bracket-winner":"")+'">'+esc(m?.p1||"Draw pending")+'</span>'+
          '<span class="'+(m&&sheetKey(m.winner)===sheetKey(m.p2)?"bracket-winner":"")+'">'+esc(m?.p2||"—")+'</span>'+
          '</button>';
      }).join("")+'</div>';
  }).join("");
  $("knockoutDetail").textContent="Select a published match to see details.";
}

let refreshInFlight=null;
let lastRefreshAt=0;
const dataFreshness={schedule:false,results:false,standings:false};
async function refreshData(){
  if(refreshInFlight)return refreshInFlight;
  refreshInFlight=(async()=>{
    const status=$("liveStatus"),errBox=$("liveError"),checked=$("lastUpdated"),refreshBtn=$("refreshBtn");
    if(refreshBtn)refreshBtn.disabled=true;
    status.textContent="Checking Google Sheets…";
    status.className="status-pill";
    if(errBox){errBox.style.display="none";errBox.textContent=""}

    const core=["Groups","Schedule","Results recording","Standing"];
    const names=[...core,"Knockout","Announcements"];
    const responses=await Promise.allSettled(names.map(name=>fetchSheet(name)));
    const loaded={};
    const errors=[];
    responses.forEach((response,i)=>{
      if(response.status==="fulfilled")loaded[names[i]]=response.value;
      else if(core.includes(names[i]))errors.push(names[i]+": "+String(response.reason?.message||response.reason));
    });

    if(loaded.Groups){
      const parsed=parseGroups(loaded.Groups);
      if(parsed.length===42&&new Set(parsed.map(x=>sheetKey(x.player))).size===42)state.groups=parsed;
      else errors.push("Groups: expected 42 unique players; keeping previous data.");
    }

    let scheduleFresh=false,scheduleLoaded=false;
    if(loaded.Schedule){
      const parsed=parseSchedule(loaded.Schedule);
      const issues=validateScheduleData(parsed,state.groups);
      // Show the latest sheet even if a fixture needs correction; never hide a
      // legitimate reschedule behind an old built-in schedule.
      if(parsed.length>=80&&state.groups.length===42){
        state.schedule=parsed;
        scheduleLoaded=true;
        scheduleFresh=issues.length===0;
        if(issues.length)errors.push("Schedule needs review: "+issues.slice(0,3).join(" ")+" Displaying the latest sheet.");
      }else errors.push("Schedule could not be parsed reliably; keeping previous data.");
    }
    let scheduleCached=!scheduleLoaded;
    if(scheduleCached&&!state.schedule.length)state.schedule=FALLBACK_SCHEDULE;
    let resultsFresh=false;
    if(loaded["Results recording"]){
      const parsed=parseResults(loaded["Results recording"]);
      const issues=validateResultData(parsed,state.schedule);
      // This feed is independent of the Schedule feed: changed match times
      // never invalidate results or standings. Keep the fetched results visible
      // even if the schedule is cached or a separate integrity check warns.
      state.results=parsed;
      resultsFresh=true;
      if(issues.length)errors.push("Some result entries need review ("+issues.length+"). Live results are still displayed.");
    }
    if(loaded.Knockout)state.knockout=parseKnockout(loaded.Knockout);
    const sheetStandings=loaded.Standing?parseStandings(loaded.Standing):[];
    // One canonical calculation from recorded games, avoiding conflicting sheet ratios.
    if(resultsFresh&&state.groups.length)state.standings=deriveStandings();
    else if(sheetStandings.length===42&&!state.standings.length)state.standings=sheetStandings;
    dataFreshness.schedule=scheduleFresh;
    dataFreshness.results=resultsFresh;
    dataFreshness.standings=resultsFresh&&state.groups.length===42;
    if(loaded.Announcements){
      const merged=[...FALLBACK_ANNOUNCEMENTS];
      for(const notice of parseAnnouncements(loaded.Announcements)){
        const index=merged.findIndex(x=>x.id===notice.id);
        if(index>=0)merged[index]=notice;else merged.push(notice);
      }
      state.announcements=merged;
    }else if(!state.announcements.length){
      state.announcements=[...FALLBACK_ANNOUNCEMENTS];
    }

    const coreOk=state.groups.length>0&&state.schedule.length>0;
    // The status summarizes feed freshness; it is not a gate for displaying
    // either sheet. A rescheduled fixture's date/time mismatch is irrelevant.
    const liveCore=Boolean(loaded.Groups&&loaded.Schedule&&loaded["Results recording"])&&scheduleLoaded&&resultsFresh;
    status.dataset.results=String(state.results.length);
    status.dataset.standings=String(state.standings.length);
    if(coreOk&&liveCore&&errors.length===0){
      status.textContent="Live updates";
      status.className="status-pill live";
    }else if(coreOk){
      status.textContent=scheduleCached&&resultsFresh?"Live results · schedule cached":
        scheduleCached?"Schedule cached · check before playing":"Live updates limited";
      status.className="status-pill fallback";
    }else{
      status.textContent="Live data unavailable";
      status.className="status-pill fallback";
    }
    const warning=[
      ...(scheduleCached?["The latest schedule could not be confirmed. Dates may have changed — use the Google Sheet or Refresh before playing."]:[]),
      ...errors.filter(e=>!scheduleCached||!e.startsWith("Schedule:"))
    ];
    if(errBox&&warning.length){
      errBox.style.display="block";
      errBox.textContent=warning.join(" | ");
    }
    const now=new Date();
    lastRefreshAt=Date.now();
    if(checked){
      const time=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Prague"}).format(now);
      checked.textContent="Checked "+time+" Prague time"+(liveCore?"":" · some data may be older");
    }
    status.title=liveCore
      ?"Groups "+state.groups.length+" · Schedule "+state.schedule.length+" · Results "+state.results.length+" · Standings "+state.standings.length
      :warning.join("\n");
    renderAll();
    if(refreshBtn)refreshBtn.disabled=false;
  })();
  try{return await refreshInFlight}
  finally{refreshInFlight=null}
}

function renderFeaturedRematches(){
  const panel=$("featuredRematchesPanel");
  const list=$("featuredRematchesList");
  if(!panel||!list)return;
  const fixtures=FEATURED_2025_REMATCHES.map(feature=>{
    const pair=feature.players.map(sheetKey).sort().join("|");
    const match=state.schedule.find(m=>sheetKey(m.group)===sheetKey(feature.group)
      && [sheetKey(m.p1),sheetKey(m.p2)].sort().join("|")===pair);
    return match&&rematch2025(match)?{match,feature}:null;
  }).filter(Boolean).sort((a,b)=>matchTime(a.match)-matchTime(b.match));
  panel.hidden=fixtures.length===0;
  if(!fixtures.length){list.innerHTML="";return}
  $("featuredRematchesSubtitle").textContent=fixtures.length+" historical "+(fixtures.length===1?"rematch":"rematches")+" still ahead — highlights disappear once results are recorded.";
  list.innerHTML=fixtures.map(({match:m,feature:f})=>
    '<article class="rematch-feature-card">'+
      '<div class="rematch-feature-top"><span class="rematch-tag">2025 rematch</span><span class="rematch-feature-date">'+esc(fmtDate(m.date))+' · Group '+esc(m.group)+'</span></div>'+
      '<div class="rematch-feature-players"><strong>'+esc(m.p1)+'</strong><span>vs</span><strong>'+esc(m.p2)+'</strong></div>'+
      '<p class="rematch-feature-story">'+esc(f.story)+'</p>'+
      (f.note?'<p class="rematch-feature-note">'+esc(f.note)+'</p>':'<p class="rematch-feature-time">Scheduled '+esc(m.time||"time TBC")+' · subject to rearrangement</p>')+
    '</article>').join("");
}

function renderHome(){
  const done=new Set(state.results.map(r=>pairKey(r.group,r.p1,r.p2)));
  const remaining=state.schedule.filter(m=>!done.has(pairKey(m.group,m.p1,m.p2)));
  const now=Date.now();
  const future=remaining.filter(m=>matchTime(m)>=now).sort((a,b)=>matchTime(a)-matchTime(b));
  const past=remaining.filter(m=>matchTime(m)<now).sort((a,b)=>matchTime(b)-matchTime(a));
  const next=[...future,...past].slice(0,6);
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Prague",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const part=t=>parts.find(x=>x.type===t)?.value||"";
  const pragueDay=part("year")+"-"+part("month")+"-"+part("day");
  const upcomingToday=next.filter(m=>m.date===pragueDay&&matchTime(m)>=now);
  const other=next.filter(m=>!upcomingToday.includes(m));
  const cards=items=>items.map(m=>matchCard(m)+(matchTime(m)<now?'<div class="match-schedule-note">Scheduled time passed · result pending or match rescheduled</div>':"")).join("");
  $("nextMatches").innerHTML=next.length?
    (upcomingToday.length?'<div class="match-period-label">Today · Prague time</div>'+cards(upcomingToday):"")+
    (other.length?'<div class="match-period-label">'+(upcomingToday.length?"Coming up / awaiting updates":"Next fixtures · Prague time")+'</div>'+cards(other):"")
    :"All group-stage matches completed.";
  const latest=sortedResults(state.results).slice(0,6);
  $("latestResults").innerHTML=latest.length?latest.map(r=>
    '<div class="result-card"><div class="match-meta">'+(r.date?esc(fmtDate(r.date))+' · ':'')+'Group '+esc(r.group)+'</div>'+
    '<div><strong>'+esc(r.winner)+'</strong> won'+(r.forfeit==="Y"?" by forfeit":resultScoreSummary(r)==="Result recorded"?"":" "+esc(resultScoreSummary(r)))+
    (isFiveGameMatch(r)?' <span class="close-match-tag">Five-game thriller</span>':"")+'</div>'+
    '<div class="small-note">'+esc(r.p1)+' vs '+esc(r.p2)+'</div></div>').join(""):"No results recorded yet.";
  renderProgress();
  renderLeagueStories();
  renderFeaturedRematches();
  renderMyMatches();
}
function renderMyMatches(){
  const q=sheetKey($("homePlayerSearch").value),el=$("myMatches");
  if(q.length<2){el.innerHTML="";$("playerDashboard").innerHTML="";return}
  const found=[...new Set(state.groups.map(p=>p.player))].filter(p=>sheetKey(p).includes(q));
  const exact=found.find(p=>sheetKey(p)===q);
  const players=exact?[exact]:found;
  if(players.length>1){
    $("playerDashboard").innerHTML='<p class="small-note">Select your name to see only your fixtures.</p>';
    el.innerHTML='<div class="player-choice-list">'+players.map(p=>
      '<button type="button" class="player-choice" data-player-name="'+esc(p)+'">'+esc(p)+'</button>'
    ).join("")+'</div>';
    return;
  }
  if(!players.length){
    $("playerDashboard").innerHTML="";
    el.innerHTML='<p class="muted-empty">No matching player found. Try another spelling.</p>';
    return;
  }
  const player=players[0];
  const matches=state.schedule.filter(m=>sheetKey(m.p1)===sheetKey(player)||sheetKey(m.p2)===sheetKey(player));
  const completed=matches.filter(m=>Boolean(resultForMatch(m))).sort((x,y)=>matchTime(y)-matchTime(x));
  const pending=matches.filter(m=>!resultForMatch(m)&&matchTime(m)<Date.now()).sort((x,y)=>matchTime(y)-matchTime(x));
  const upcoming=matches.filter(m=>!resultForMatch(m)&&matchTime(m)>=Date.now()).sort((x,y)=>matchTime(x)-matchTime(y));
  renderPlayerDashboard(players);
  const group=(label,items,kind)=>items.length?
    '<section class="player-fixture-group"><h4>'+label+' <span>'+items.length+'</span></h4>'+
    (kind==="pending"?'<p class="player-fixture-hint">Scheduled time passed. The match may have been rearranged or its result not yet recorded.</p>':"")+
    '<div class="player-fixture-list">'+items.map(m=>playerMatchCard(m,player)).join("")+'</div></section>':"";
  el.innerHTML=matches.length
    ?group("Upcoming matches",upcoming,"upcoming")+group("Awaiting update",pending,"pending")+group("Completed matches",completed,"completed")
    :'<p class="muted-empty">No group-stage fixtures found for this player.</p>';
}

function resultScoreSummary(r){
  if(r.forfeit==="Y")return "Forfeit";
  const fromSheet=scorePair(r.setScore);
  if(fromSheet)return Math.max(...fromSheet)+"–"+Math.min(...fromSheet);
  let p1=0,p2=0;
  for(const s of r.scores||[]){
    const pair=scorePair(s);
    if(pair){if(pair[0]>pair[1])p1++;else if(pair[1]>pair[0])p2++}
  }
  return p1||p2?Math.max(p1,p2)+"–"+Math.min(p1,p2):"Result recorded";
}
function isFiveGameMatch(r){
  if(r.forfeit==="Y")return false;
  const pair=scorePair(r.setScore);
  return pair?Math.min(...pair)===2&&Math.max(...pair)===3:(r.scores||[]).length===5;
}
function resultTimestamp(r){
  const stamp=norm(r.updatedAt);
  if(stamp){
    const normalized=stamp.replace(" ","T");
    const parsed=Date.parse(normalized);
    if(Number.isFinite(parsed))return parsed;
  }
  const date=norm(r.date);
  if(date){
    const parsed=Date.parse(date);
    if(Number.isFinite(parsed))return parsed;
  }
  return 0;
}
function sortedResults(results){
  return [...results].sort((a,b)=>resultTimestamp(b)-resultTimestamp(a)||(b.rowIndex??0)-(a.rowIndex??0));
}
function isComeback(r){
  if(r.forfeit==="Y"||!Array.isArray(r.scores)||r.scores.length!==5)return false;
  const first=r.scores.slice(0,2).map(scorePair),last=r.scores.slice(2).map(scorePair);
  if(first.some(x=>!x)||last.some(x=>!x))return false;
  const downFirst=first.every(x=>x[0]<x[1]);
  const downSecond=first.every(x=>x[1]<x[0]);
  return (downFirst&&last.every(x=>x[0]>x[1]))||(downSecond&&last.every(x=>x[1]>x[0]));
}
function renderLeagueStories(){
  const panel=$("aroundLeaguePanel"),list=$("aroundLeague");
  if(!panel||!list)return;
  const completed=new Set(state.results.map(r=>pairKey(r.group,r.p1,r.p2))).size;
  const milestones=[25,50,75,100].filter(n=>completed>=n);
  const completedGroups="ABCDEFG".split("").filter(g=>{
    const matches=state.schedule.filter(m=>m.group===g);
    return matches.length===15&&matches.every(m=>state.results.some(r=>pairKey(r.group,r.p1,r.p2)===pairKey(m.group,m.p1,m.p2)));
  });
  const highlights=sortedResults(state.results).filter(r=>isFiveGameMatch(r)).slice(0,2);
  const stories=[];
  if(milestones.length)stories.push({title:milestones.at(-1)+" matches completed",body:"A group-stage milestone for the whole league."});
  if(completedGroups.length)stories.push({title:"Group "+completedGroups.join(", ")+" complete",body:"All 15 fixtures have recorded results."});
  for(const r of highlights)stories.push({title:isComeback(r)?"A comeback from two games down":"Five-game thriller",
    body:r.p1+" vs "+r.p2+" · Group "+r.group+" · "+r.winner+" won "+resultScoreSummary(r)});
  panel.hidden=!stories.length;
  list.innerHTML=stories.slice(0,3).map(x=>'<article class="league-story"><strong>'+esc(x.title)+'</strong><p>'+esc(x.body)+'</p></article>').join("");
}

function renderResults(){
  const list=$("resultsList"),count=$("resultsCount");
  const notice=$("resultsSourceNotice");
  if(notice){
    notice.hidden=dataFreshness.results;
    notice.textContent=dataFreshness.results?"":"Results could not be confirmed from Google Sheets. Displayed results may be incomplete or older.";
  }
  if(!list)return;
  const q=sheetKey($("resultsSearch")?.value||"");
  const group=$("resultsGroupFilter")?.value||"";
  const results=sortedResults(state.results.filter(r=>(!group||r.group===group)&&
    (!q||sheetKey(r.p1).includes(q)||sheetKey(r.p2).includes(q)||sheetKey(r.winner).includes(q))));
  if(count)count.textContent=results.length+" of "+state.results.length+" recorded results";
  list.innerHTML=results.length?results.map(r=>{
    const score=resultScoreSummary(r);
    const games=r.scores?.length&&r.forfeit!=="Y"
      ?'<div class="result-games"><span>Game scores (Player 1–Player 2)</span><strong>'+
        r.scores.map(esc).join(' · ')+'</strong></div>':"";
    return '<article class="result-browser-card">'+
      '<div class="result-browser-top"><span>Group '+esc(r.group)+(r.date?' · '+esc(fmtDate(r.date)):'')+'</span>'+
      (isFiveGameMatch(r)?'<span class="close-match-tag">Five-game thriller</span>':"")+'</div>'+
      '<div class="result-browser-players"><span>'+esc(r.p1)+'</span><b>vs</b><span>'+esc(r.p2)+'</span></div>'+
      '<div class="result-browser-winner"><strong>'+esc(r.winner)+'</strong> won'+(score==="Forfeit"?' by forfeit':score==="Result recorded"?"":' '+esc(score))+'</div>'+
      games+'</article>';
  }).join(""):'<p class="muted-empty">No recorded results match your search.</p>';
}

function renderSchedule(){
  const notice=$("scheduleSourceNotice");
  if(notice){
    notice.hidden=dataFreshness.schedule;
    notice.textContent=dataFreshness.schedule?"":"The schedule has not passed every integrity check or could not be confirmed. Please verify questionable fixtures in Google Sheets.";
  }
  const q=sheetKey($("scheduleSearch").value),g=$("groupFilter").value,w=$("weekFilter").value;
  const matches=state.schedule.filter(m=>(!g||m.group===g)&&(!w||String(m.week)===w)&&
    (!q||sheetKey(m.p1).includes(q)||sheetKey(m.p2).includes(q)));
  const cards=matches.map(m=>{
    const r=resultForMatch(m),past=matchTime(m)<Date.now();
    const status=r?(r.forfeit==="Y"?"Completed · forfeit":"Completed · "+resultScoreSummary(r)):
      past?"Time passed · awaiting update":"Scheduled";
    return '<article class="mobile-schedule-card">'+
      '<div class="mobile-schedule-top"><strong>Group '+esc(m.group)+'</strong><span>Week '+esc(m.week)+'</span></div>'+
      '<div class="mobile-schedule-players">'+esc(m.p1)+' <span>vs</span> '+esc(m.p2)+'</div>'+
      '<div class="mobile-schedule-bottom"><span>'+esc(fmtDate(m.date))+' · '+esc(m.time)+' Prague</span>'+
      '<span class="schedule-table-status '+(r?"completed":past?"pending":"scheduled")+'">'+esc(status)+'</span></div></article>';
  }).join("");
  $("scheduleTableWrap").innerHTML='<div class="mobile-schedule-list">'+cards+'</div><div class="table-wrap desktop-schedule-table"><table><thead><tr>'+
    '<th>Week</th><th>Date</th><th>Time</th><th>Group</th><th>Player 1</th><th>Player 2</th><th>Status</th>'+
    '</tr></thead><tbody>'+matches.map(m=>{
      const r=resultForMatch(m);
      const past=matchTime(m)<Date.now();
      const label=r?'Completed'+(r.forfeit==="Y"?' · forfeit':' · '+resultScoreSummary(r)):
        past?'Time passed · update pending':'Scheduled';
      return '<tr><td>'+esc(m.week)+'</td><td>'+esc(fmtDate(m.date))+'</td><td>'+esc(m.time)+'</td>'+
        '<td>'+esc(m.group)+'</td><td>'+esc(m.p1)+'</td><td>'+esc(m.p2)+rematchMarkup(m,true)+'</td>'+
        '<td><span class="schedule-table-status '+(r?'completed':past?'pending':'scheduled')+'">'+esc(label)+'</span></td></tr>';
    }).join("")+'</tbody></table></div>'+
    (!matches.length?'<p class="muted-empty">No matches found for these filters.</p>':"");
}

function renderGroups(){
  $("groupsGrid").innerHTML="ABCDEFG".split("").map(g=>`<div class="group-card"><h3>Group ${g}</h3>${state.groups.filter(x=>x.group===g).map(p=>`<div class="player-row"><span>${esc(p.player)}</span><span class="role">${esc(p.role)}</span></div>`).join("")}</div>`).join("");
}
function renderStandings(){
  const notice=$("standingsSourceNotice");
  if(notice){
    notice.hidden=dataFreshness.standings;
    notice.textContent=dataFreshness.standings?"":"Live standings could not be confirmed. Rankings may be incomplete or older.";
  }
  const el=$("standingsGrid");
  if(!state.standings.length){
    el.innerHTML='<p class="muted-empty">Waiting for live standings data.</p>';$("wildcardTable").innerHTML="";$("qualifiers").innerHTML="";return;
  }
  const e=eligibleByGroup();
  const all=new Set(state.schedule.map(m=>pairKey(m.group,m.p1,m.p2)));
  const recorded=new Set(state.results.map(r=>pairKey(r.group,r.p1,r.p2)));
  const finished=all.size===105&&[...all].every(k=>recorded.has(k));
  const wc=wildcards();
  const pendingTies="ABCDEFG".split("").some(g=>unresolvedTie(e[g]?.[1],e[g]?.[2]))||unresolvedTie(wc[1],wc[2]);
  $("qualifiersTitle").textContent=finished&&!pendingTies?"Round of 16 field":"Projected Round of 16 field";
  $("qualifiersNote").textContent=pendingTies?"A qualifying-place tie remains unresolved. The Sports Representative will decide it.":
    finished?"Based on all recorded group-stage results.":"Current positions only — qualification is not yet final.";
  el.innerHTML="ABCDEFG".split("").map(g=>{
    const a=state.standings.filter(x=>x.group===g).sort(compareRank);
    const eligible=e[g]||[];
    const q=new Set(eligible.slice(0,2).filter(x=>qualificationStatus(x,eligible,wc)==="Automatic position").map(x=>x.player));
    return `<div class="group-standing"><div class="group-title">Group ${g}</div><div class="table-wrap"><table><thead><tr><th>#</th><th>Player</th><th title="Wins">W</th><th title="Losses">L</th><th title="Matches played">P</th><th title="Win rate">Win%</th><th title="Share of games won">Set%</th><th>KO eligibility</th></tr></thead><tbody>${a.map((x,i)=>`<tr class="${q.has(x.player)?"rank-auto":""}"><td>${i>0&&unresolvedTie(a[i-1],x)?"=":i+1}</td><td>${esc(x.player)} ${qualificationStatus(x,eligible,wc)==="Tie — decision pending"?'<span class="badge">Tie · decision pending</span>':q.has(x.player)?(finished&&!pendingTies?'<span class="badge qual">Qualified</span>':'<span class="badge qual">In position</span>'):""}</td><td>${x.wins}</td><td>${x.losses}</td><td>${x.matches}</td><td>${pct(x.winRate)}</td><td>${pct(x.setRatio)}</td><td><span class="eligibility-tag ${x.matches>=3?"eligible":"not-yet"}">${x.matches>=3?"Eligible":Math.min(x.matches,3)+"/3 played"}</span></td></tr>`).join("")}</tbody></table></div></div>`;
  }).join("");
  const context=$("wildcardContext");
  if(context){
    if(unresolvedTie(wc[1],wc[2])){
      context.textContent="The final wildcard position is tied on every ranking criterion. Organizer decision pending.";
    }else if(wc.length>=3&&wc[1].wins===wc[2].wins){
      context.textContent="Close race: the second and third wildcard candidates are tied on wins. The published tiebreakers determine their order.";
    }else if(wc.length>=3&&wc[1].wins-wc[2].wins===1){
      context.textContent="Close race: one win separates the second and third wildcard candidates. Positions can still change.";
    }else{
      context.textContent="Only players with at least 3 recorded matches appear here. Positions remain provisional until the group stage ends.";
    }
  }
  $("wildcardTable").innerHTML=`<div class="table-wrap"><table><thead><tr><th>#</th><th>Group</th><th>Player</th><th>W</th><th>P</th><th>Win%</th><th>Set%</th><th>PD</th></tr></thead><tbody>${wc.map((x,i)=>`<tr class="${i<2&&!unresolvedTie(wc[1],wc[2])?"rank-wild":""}"><td>${i>0&&unresolvedTie(wc[i-1],x)?"=":i+1}</td><td>${x.group}</td><td>${esc(x.player)}</td><td>${x.wins}</td><td>${x.matches}</td><td>${pct(x.winRate)}</td><td>${pct(x.setRatio)}</td><td>${x.pointDiff}</td></tr>`).join("")}</tbody></table></div>`;
  const q=[];for(const g of "ABCDEFG"){
    if(e[g]?.[0]&&!unresolvedTie(e[g][0],e[g][2]))q.push([g+"1",e[g][0].player]);
    if(e[g]?.[1]&&!unresolvedTie(e[g][1],e[g][2]))q.push([g+"2",e[g][1].player]);
    if(unresolvedTie(e[g]?.[1],e[g]?.[2]))q.push([g+"2","Tie — decision pending"]);
  }
  if(wc[0])q.push(["WC1",wc[0].player]);
  if(wc[1])q.push(["WC2",unresolvedTie(wc[1],wc[2])?"Tie — decision pending":wc[1].player]);
  $("qualifiers").innerHTML=`<div class="qual-list">${q.map(([s,p])=>`<div class="qual-item"><strong>${s}</strong> • ${esc(p)}</div>`).join("")}</div>`;
}

let scoreWriteEnabled=false, scoreSubmitting=false;
function scoreMatchKey(m){return [m.group,m.p1,m.p2].join("|")}
function matchHasResult(m){return Boolean(resultForMatch(m))}
function renderScoreForm(){
  const selector=$("scoreMatchSelect");
  if(!selector)return;
  const oldMatch=selectedScoreMatch();
  const oldKey=oldMatch?scoreMatchKey(oldMatch):"";
  const search=sheetKey($("scoreMatchSearch")?.value||"");
  const matches=state.schedule.filter(m=>m.p1&&m.p2).slice()
    .sort((a,b)=>(a.date||"").localeCompare(b.date||"")||(a.time||"").localeCompare(b.time||""));
  const unique=new Map();
  for(const m of matches)unique.set(scoreMatchKey(m),m);
  scoreFormMatches=[...unique.values()];
  const visible=scoreFormMatches.map((m,i)=>({m,i})).filter(({m})=>
    !search||sheetKey(m.p1).includes(search)||sheetKey(m.p2).includes(search)||
    sheetKey("group "+m.group).includes(search));
  selector.innerHTML='<option value="">'+(visible.length?"Choose your match…":"No matches found — try another name")+'</option>'+
    visible.map(({m,i})=>{
      const recorded=matchHasResult(m);
      return '<option value="'+i+'">'+esc('Group '+m.group+' · '+m.p1+' vs '+m.p2+
        (recorded?' (recorded — can replace)':''))+'</option>';
    }).join("");
  const current=visible.find(({m})=>scoreMatchKey(m)===oldKey);
  if(current)selector.value=String(current.i);
  const newMatch=selectedScoreMatch();
  const changed=scoreMatchKey(newMatch||{group:"",p1:"",p2:""})!==oldKey;
  if(changed){
    document.querySelectorAll("#scoreGames input").forEach(x=>x.value="");
    if($("scoreEntryFeedback"))$("scoreEntryFeedback").textContent="";
  }
  showScoreMatch(!changed);
}
let scoreFormMatches=[];
function selectedScoreMatch(){
  const v=$("scoreMatchSelect")?.value;
  return v!=="" && v!=null ? scoreFormMatches[Number(v)] : null;
}
function scoreEntryIsForfeit(){return $("scoreResultType")?.value==="forfeit"}
function showScoreMatch(preserveFields=false){
  const m=selectedScoreMatch();
  const names=$("scoreSelectedMatch"),games=$("scoreGames");
  if(!names||!games)return;
  names.textContent=m?m.p1+" (Player 1) vs "+m.p2+" (Player 2)":"Choose a match to see the players' names.";
  const recorded=m&&resultForMatch(m);
  const existing=$("scoreExistingResult");
  if(existing){
    existing.hidden=!recorded;
    existing.textContent=recorded
      ?"Already recorded: "+recorded.winner+" won"+(recorded.forfeit==="Y"?" by forfeit":recorded.setScore?" "+recorded.setScore:"")+". Submitting again will replace this result."
      :"";
  }
  const forfeitWinner=$("scoreForfeitWinner");
  if(forfeitWinner){
    const oldWinner=preserveFields?forfeitWinner.value:"";
    forfeitWinner.innerHTML='<option value="">Choose the winner…</option>'+
      (m?'<option value="p1">'+esc(m.p1)+'</option><option value="p2">'+esc(m.p2)+'</option>':"");
    forfeitWinner.value=oldWinner;
  }
  if(!games.children.length){
    games.innerHTML=[0,1,2,3,4].map(i=>'<div class="score-game-row"><span>Game '+(i+1)+'</span><input aria-label="Game '+(i+1)+' Player 1 points" type="number" min="0" max="99" inputmode="numeric" data-side="0" data-game="'+i+'" placeholder="P1"><b>–</b><input aria-label="Game '+(i+1)+' Player 2 points" type="number" min="0" max="99" inputmode="numeric" data-side="1" data-game="'+i+'" placeholder="P2"></div>').join("");
  }
  if(!preserveFields){
    const type=$("scoreResultType");
    if(type)type.value=recorded?.forfeit==="Y"?"forfeit":"normal";
    const inputs=[...games.querySelectorAll("input")];
    inputs.forEach(input=>input.value="");
    if(recorded?.forfeit==="Y"){
      if(forfeitWinner)forfeitWinner.value=sheetKey(recorded.winner)===sheetKey(m.p1)?"p1":"p2";
    }else if(recorded?.scores?.length){
      recorded.scores.forEach((score,i)=>{
        const pair=scorePair(score);
        if(pair&&inputs[i*2]&&inputs[i*2+1]){
          inputs[i*2].value=String(pair[0]);
          inputs[i*2+1].value=String(pair[1]);
        }
      });
    }
  }
  updateScoreEntryType();
}
function updateScoreEntryType(){
  const forfeit=scoreEntryIsForfeit();
  if($("scoreNormalFields"))$("scoreNormalFields").hidden=forfeit;
  if($("scoreForfeitFields"))$("scoreForfeitFields").hidden=!forfeit;
  validateScoreForm();
}
function readScoreForm(){
  const cells=[...document.querySelectorAll("#scoreGames input")];
  const games=[];
  let sawGap=false;
  for(let i=0;i<5;i++){
    const left=cells[2*i]?.value.trim()??"",right=cells[2*i+1]?.value.trim()??"";
    if(!left&&!right){sawGap=true;continue}
    if(sawGap)throw Error("Fill the games in order, without skipping a row.");
    if(!left||!right)throw Error("Enter both players' points for game "+(i+1)+".");
    const x=Number(left),y=Number(right);
    if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>99||y>99 ||
      Math.max(x,y)<11 || Math.abs(x-y)<2 ||
      (Math.max(x,y)>11 && Math.abs(x-y)!==2))
      throw Error("Check game "+(i+1)+": win with at least 11 points, by 2.");
    games.push([x,y]);
  }
  if(games.length<3)throw Error("Enter at least three completed games.");
  let a=0,b=0;
  for(let i=0;i<games.length;i++){
    if(a===3||b===3)throw Error("Stop entering games once someone has won three.");
    if(games[i][0]>games[i][1])a++;else b++;
  }
  if(Math.max(a,b)!==3)throw Error("The winning player must win three games.");
  return {games,wins:[a,b]};
}
function validateScoreForm(){
  const btn=$("scoreSubmitBtn"),feedback=$("scoreEntryFeedback"),winner=$("scoreLiveWinner");
  if(!btn||!winner)return;
  btn.disabled=true;
  const match=selectedScoreMatch();
  if(!match){winner.textContent="Choose your match first.";return}
  try{
    let who,summary;
    if(scoreEntryIsForfeit()){
      const side=$("scoreForfeitWinner")?.value;
      if(side!=="p1"&&side!=="p2")throw Error("Choose who wins by forfeit.");
      who=side==="p1"?match.p1:match.p2;
      summary=who+" wins by forfeit. No games or points awarded.";
    }else{
      const result=readScoreForm();
      who=result.wins[0]===3?match.p1:match.p2;
      summary=who+" wins "+Math.max(...result.wins)+"–"+Math.min(...result.wins)+" games.";
    }
    winner.textContent=summary;
    btn.disabled=!scoreWriteEnabled||scoreSubmitting;

  }catch(e){
    winner.textContent=e.message;

  }
}
async function checkScoreWriteAvailability(){
  try{
    const r=await fetch("/api/score-status",{cache:"no-store"});
    if(!r.ok)throw Error("Unavailable");
    scoreWriteEnabled=Boolean((await r.json()).enabled);
  }catch{scoreWriteEnabled=false}
  const notice=$("scoreEntryAvailability");
  if(notice)notice.textContent=scoreWriteEnabled
    ?"Direct score recording is available. Enter your match result below."
    :"Direct score recording is awaiting organizer setup. Please use the Google Sheet link in the instructions below for now.";
  validateScoreForm();
}
async function submitScoreForm(e){
  e.preventDefault();
  if(scoreSubmitting||!scoreWriteEnabled)return;
  const match=selectedScoreMatch();
  if(!match)return;
  const forfeit=scoreEntryIsForfeit();
  let payload={group:match.group,p1:match.p1,p2:match.p2,forfeit};
  let summary;
  try{
    if(forfeit){
      const side=$("scoreForfeitWinner")?.value;
      if(side!=="p1"&&side!=="p2")throw Error("Choose who wins by forfeit.");
      payload.winner=side==="p1"?match.p1:match.p2;
      summary=payload.winner+" wins by forfeit";
    }else{
      const checked=readScoreForm();
      payload.scores=checked.games;
      summary=(checked.wins[0]===3?match.p1:match.p2)+" wins "+Math.max(...checked.wins)+"–"+Math.min(...checked.wins);
    }
  }catch(err){$("scoreEntryFeedback").textContent=err.message;return}
  const existing=matchHasResult(match);
  if(!window.confirm((existing?"Replace the existing result?\n\n":"Submit this result?\n\n")+
    match.p1+" vs "+match.p2+"\n"+summary+
    (existing?"\n\nThe previous result will be overwritten.":"")))return;
  scoreSubmitting=true;validateScoreForm();
  $("scoreEntryFeedback").textContent="Saving to Google Sheets…";
  try{
    const r=await fetch("/api/submit-score",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify(payload)
    });
    const data=await r.json();
    if(!r.ok||!data.ok)throw Error(data.error||"Could not save the result.");
    document.querySelectorAll("#scoreGames input").forEach(x=>x.value="");
    await refreshData();
    openView("record-score");
    $("scoreEntryFeedback").textContent="Saved! "+data.winner+
      (data.forfeit?" won by forfeit.":" won "+data.setScore+".")+
      " The result and standings have been refreshed from Google Sheets."+(data.auditLogged===false?" WARNING: "+(data.auditWarning||"Change history could not be recorded."):"");
  }catch(err){$("scoreEntryFeedback").textContent=err.message+" If you're unsure whether it saved, check the Google Sheet before trying again."}
  finally{scoreSubmitting=false;validateScoreForm()}
}

function removeExpiredPromotions(){
  // Older cached HTML may still contain the removed homepage promotion.
  document.querySelectorAll(".history-panel").forEach(el=>el.remove());
}
function renderAll(){removeExpiredPromotions();renderHome();renderSchedule();renderResults();renderGroups();renderStandings();renderKnockout();renderNotifications();renderScoreForm()}
removeExpiredPromotions();

document.querySelectorAll(".tab,[data-view='record-score'],[data-view='change-schedule'],[data-view='results']").forEach(b=>b.addEventListener("click",()=>openView(b.dataset.view)));
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
$("knockoutBracket").addEventListener("click",e=>{
  const btn=e.target.closest("[data-bracket-round]");
  if(!btn)return;
  const match=state.knockout.filter(x=>x.round===btn.dataset.bracketRound).sort((a,b)=>a.match-b.match)[Number(btn.dataset.bracketIndex)];
  if(!match)return;
  $("knockoutDetail").textContent=match.p1+" vs "+match.p2+(match.winner?" · Winner: "+match.winner:" · Awaiting result")+(match.date?" · "+match.date:"")+(match.time?" "+match.time:"");
});
$("myMatches").addEventListener("click",e=>{
  const playerButton=e.target.closest("[data-player-name]");
  if(playerButton){
    $("homePlayerSearch").value=playerButton.dataset.playerName;
    renderMyMatches();
    return;
  }
  const btn=e.target.closest("[data-record-match]");
  if(!btn)return;
  if($("scoreMatchSearch"))$("scoreMatchSearch").value="";
  renderScoreForm();
  const index=scoreFormMatches.findIndex(m=>scoreMatchKey(m)===btn.dataset.recordMatch);
  if(index<0)return;
  $("scoreMatchSelect").value=String(index);
  document.querySelectorAll("#scoreGames input").forEach(x=>x.value="");
  if($("scoreEntryFeedback"))$("scoreEntryFeedback").textContent="";
  showScoreMatch(false);
  openView("record-score");
});
$("scheduleSearch").addEventListener("input",renderSchedule);
$("resultsSearch")?.addEventListener("input",renderResults);
$("resultsGroupFilter")?.addEventListener("change",renderResults);
$("groupFilter").addEventListener("change",renderSchedule);
$("weekFilter").addEventListener("change",renderSchedule);
$("refreshBtn").addEventListener("click",refreshData);
document.addEventListener("visibilitychange",()=>{
  if(!document.hidden&&!scoreSubmitting&&Date.now()-lastRefreshAt>60000)refreshData();
});
window.addEventListener("focus",()=>{
  if(!document.hidden&&!scoreSubmitting&&Date.now()-lastRefreshAt>60000)refreshData();
});
$("scoreMatchSearch")?.addEventListener("input",renderScoreForm);
$("scoreMatchSelect")?.addEventListener("change",()=>{
  document.querySelectorAll("#scoreGames input").forEach(x=>x.value="");
  if($("scoreEntryFeedback"))$("scoreEntryFeedback").textContent="";
  showScoreMatch(false);
});
$("scoreGames")?.addEventListener("input",()=>{$("scoreEntryFeedback").textContent="";validateScoreForm()});
$("scoreResultType")?.addEventListener("change",()=>{$("scoreEntryFeedback").textContent="";updateScoreEntryType()});
$("scoreForfeitWinner")?.addEventListener("change",()=>{$("scoreEntryFeedback").textContent="";validateScoreForm()});
$("scoreEntryForm")?.addEventListener("submit",submitScoreForm);
checkScoreWriteAvailability();
renderAll(); // Display the fallback immediately, even on slow or offline connections.
refreshData();
const SHEET_ID = "1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI";
const HISTORY_SHEET_ID = "1hDaOmQ4qGgQzFaiSmHOM7B1YWUxh-t2zqoPojLTxhPI";
const ALLOWED = new Set(["Groups", "Schedule", "Results recording", "Standing", "Announcements", "Knockout"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return new Response("ok", { headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    // Direct scoring is enabled only after the organizer provisions an
    // authorized Apps Script URL and shared secret in Pages.
    if (url.pathname === "/api/score-status" && request.method === "GET") {
      const configured = Boolean(env.SCORE_WRITE_URL && env.SCORE_WRITE_SECRET);
      return Response.json({ enabled: configured }, { headers: { "cache-control": "no-store" } });
    }

    // Same trusted server-to-server bridge as score recording. No player PIN.
    if (url.pathname === "/api/reschedule" && request.method === "POST") {
      if (!env.SCORE_WRITE_URL || !env.SCORE_WRITE_SECRET)
        return Response.json({ok:false,error:"Schedule editing has not been connected yet."},{status:503});
      const origin=request.headers.get("origin");
      if(origin && origin!==url.origin)
        return Response.json({ok:false,error:"Invalid origin"},{status:403});
      if((Number(request.headers.get("content-length"))||0)>2000)
        return Response.json({ok:false,error:"Submission too large"},{status:413});
      try{
        const input=await request.json();
        if(!input || typeof input!=="object" || Array.isArray(input) ||
           !/^[A-G]$/.test(input.group) || typeof input.p1!=="string" ||
           typeof input.p2!=="string" || !input.p1.trim() || !input.p2.trim() ||
           input.p1.length>100 || input.p2.length>100 ||
           typeof input.date!=="string" || typeof input.time!=="string" ||
           !/^20\d{2}-\d{2}-\d{2}$/.test(input.date) ||
           !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time))
          return Response.json({ok:false,error:"Choose a match, date, and time."},{status:400});
        const target=String(env.SCORE_WRITE_URL);
        if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(target))
          throw Error("Invalid write endpoint");
        const upstream=await fetch(target,{
          method:"POST",headers:{"content-type":"text/plain;charset=UTF-8"},
          body:JSON.stringify({secret:String(env.SCORE_WRITE_SECRET),action:"reschedule",
            group:input.group,p1:input.p1,p2:input.p2,date:input.date,time:input.time}),
          redirect:"follow"
        });
        const raw=await upstream.text();
        let data;
        try{data=JSON.parse(raw)}catch{throw Error("Google Sheets returned an unexpected response. The Apps Script may need redeployment.");}
        if(!upstream.ok||!data.ok)
          return Response.json({ok:false,error:data.error||"Could not save the new time."},{status:upstream.ok?400:502});
        return Response.json({ok:true,date:data.date,time:data.time,auditLogged:data.auditLogged,
          auditWarning:data.auditWarning||""},{headers:{"cache-control":"no-store"}});
      }catch(err){
        return Response.json({ok:false,error:String(err.message||err)},{status:400});
      }
    }

    if (url.pathname === "/api/submit-score" && request.method === "POST") {
      const configured = Boolean(env.SCORE_WRITE_URL && env.SCORE_WRITE_SECRET);
      if (!configured) return Response.json({ ok: false, error: "Direct score entry has not been connected yet. Please use Google Sheets." }, { status: 503 });
      const origin = request.headers.get("origin");
      if (origin && origin !== url.origin) return Response.json({ ok: false, error: "Invalid origin" }, { status: 403 });
      if ((Number(request.headers.get("content-length")) || 0) > 5000) return Response.json({ ok: false, error: "Submission too large" }, { status: 413 });
      try {
        const input = await request.json();
        if (!input || typeof input !== "object" || Array.isArray(input) ||
            !/^[A-G]$/.test(input.group) || typeof input.p1 !== "string" ||
            typeof input.p2 !== "string" || input.p1.length > 100 || input.p2.length > 100) {
          return Response.json({ ok: false, error: "Invalid match." }, { status: 400 });
        }
        if (input.forfeit !== true && input.forfeit !== false) return Response.json({ok:false,error:"Invalid result type."},{status:400});
        const forfeit = input.forfeit === true;
        if (forfeit) {
          if (typeof input.winner !== "string" ||
              ![input.p1, input.p2].includes(input.winner) ||
              (input.scores && input.scores.length)) {
            return Response.json({ ok: false, error: "Choose a valid forfeit winner; do not enter game scores." }, { status: 400 });
          }
        } else if (!Array.isArray(input.scores) || input.scores.length < 3 || input.scores.length > 5 ||
            input.scores.some(s => !Array.isArray(s) || s.length !== 2 ||
              s.some(n => !Number.isInteger(n) || n < 0 || n > 99))) {
          return Response.json({ ok: false, error: "Invalid game scores." }, { status: 400 });
        }
        if (!forfeit) {
          let a=0,b=0;
          for (const pair of input.scores) {
            if (a===3 || b===3) return Response.json({ok:false,error:"Do not enter games after the match is won."},{status:400});
            const [x,y]=pair;
            if (Math.max(x,y)<11 || Math.abs(x-y)<2 ||
                (Math.max(x,y)>11 && Math.abs(x-y)!==2))
              return Response.json({ok:false,error:"Each game must be won by two points, starting at 11."},{status:400});
            if(x>y)a++;else b++;
          }
          if(Math.max(a,b)!==3) return Response.json({ok:false,error:"The winner must win three games."},{status:400});
        }
        const target = String(env.SCORE_WRITE_URL);
        if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(target)) throw Error("Invalid write endpoint");
        const upstream = await fetch(target, {
          method: "POST",
          headers: { "content-type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({
            secret: String(env.SCORE_WRITE_SECRET),
            group: input.group, p1: input.p1, p2: input.p2, forfeit,
            winner: forfeit ? input.winner : undefined,
            scores: forfeit ? [] : input.scores
          }),
          redirect: "follow"
        });
        const text = await upstream.text();
        let result;
        try { result = JSON.parse(text); } catch { throw Error("Google Sheets write endpoint returned an unexpected response"); }
        if (!upstream.ok || !result.ok) {
          return Response.json({ ok: false, error: result.error || "Google Sheets could not save the match." }, { status: upstream.ok ? 400 : 502 });
        }
        return Response.json({ ok: true, winner: result.winner, setScore: result.setScore, forfeit: Boolean(result.forfeit), auditLogged: result.auditLogged, auditWarning: result.auditWarning || "" }, { headers: { "cache-control": "no-store" } });
      } catch (e) {
        return Response.json({ ok: false, error: String(e.message || e) }, { status: 400 });
      }
    }

    if (url.pathname === "/api/all-time-history") {
      const googleUrl =
        "https://docs.google.com/spreadsheets/d/" + HISTORY_SHEET_ID +
        "/gviz/tq?tqx=out:csv&_=" + Date.now();
      try {
        const upstream = await fetch(googleUrl, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache" } });
        const body = await upstream.text();
        const ct = upstream.headers.get("content-type") || "";
        if (!upstream.ok) return new Response("Historical Google Sheet returned HTTP " + upstream.status, { status: 502 });
        if (body.trim().startsWith("<") || ct.includes("text/html"))
          return new Response("Historical Google Sheet is not anonymously readable.", { status: 502 });
        return new Response(body, {
          status: 200,
          headers: {
            "content-type": "text/csv; charset=utf-8",
            "cache-control": "no-store, max-age=0",
            "x-tournament-source": "2025-history"
          }
        });
      } catch {
        return new Response("Could not reach the historical Google Sheet", { status: 502 });
      }
    }

    if (url.pathname === "/api/sheet") {
      const sheet = url.searchParams.get("sheet") || "";
      if (!ALLOWED.has(sheet)) return new Response("Invalid sheet", { status: 400 });

      const googleUrl =
        "https://docs.google.com/spreadsheets/d/" + SHEET_ID +
        "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(sheet) +
        "&_=" + Date.now();

      try {
        const upstream = await fetch(googleUrl, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache" } });
        const body = await upstream.text();
        const ct = upstream.headers.get("content-type") || "";

        if (!upstream.ok) {
          return new Response("Google Sheets returned HTTP " + upstream.status, { status: 502 });
        }

        if (body.trim().startsWith("<") || ct.includes("text/html")) {
          return new Response("Google Sheet is not anonymously readable.", { status: 502 });
        }

        return new Response(body, {
          status: 200,
          headers: {
            "content-type": "text/csv; charset=utf-8",
            "cache-control": "no-store, max-age=0",
            "x-tournament-source": "live-google-sheet"
          }
        });
      } catch {
        return new Response("Could not reach Google Sheets", { status: 502 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
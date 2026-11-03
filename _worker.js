const SHEET_ID = "1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI";
const ALLOWED = new Set(["Groups", "Schedule", "Results recording", "Standing", "Announcements"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return new Response("ok", { headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    // Direct scoring is enabled only after the organizer provisions an
    // authorized Apps Script URL, shared secret and submission PIN in Pages.
    if (url.pathname === "/api/score-status" && request.method === "GET") {
      const configured = Boolean(env.SCORE_WRITE_URL && env.SCORE_WRITE_SECRET && env.SCORE_ENTRY_PIN);
      return Response.json({ enabled: configured }, { headers: { "cache-control": "no-store" } });
    }

    if (url.pathname === "/api/submit-score" && request.method === "POST") {
      const configured = Boolean(env.SCORE_WRITE_URL && env.SCORE_WRITE_SECRET && env.SCORE_ENTRY_PIN);
      if (!configured) return Response.json({ ok: false, error: "Direct score entry has not been connected yet. Please use Google Sheets." }, { status: 503 });
      const origin = request.headers.get("origin");
      if (origin && origin !== url.origin) return Response.json({ ok: false, error: "Invalid origin" }, { status: 403 });
      if ((Number(request.headers.get("content-length")) || 0) > 5000) return Response.json({ ok: false, error: "Submission too large" }, { status: 413 });
      try {
        const input = await request.json();
        if (!input || typeof input !== "object" || !Array.isArray(input.scores)) throw Error("Invalid submission");
        const pin = String(input.pin || "");
        const authorizedPin = String(env.SCORE_ENTRY_PIN);
        // Compare in constant time; reject a missing PIN or wrong length.
        const a = new TextEncoder().encode(pin), b = new TextEncoder().encode(authorizedPin);
        let diff = a.length ^ b.length;
        for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] || 0) ^ (b[i] || 0);
        if (diff !== 0 || !pin) return Response.json({ ok: false, error: "Incorrect submission PIN." }, { status: 403 });
        if (!/^[A-G]$/.test(input.group) || typeof input.p1 !== "string" || typeof input.p2 !== "string" ||
            input.p1.length > 100 || input.p2.length > 100 || input.scores.length < 3 || input.scores.length > 5 ||
            input.scores.some(s => !Array.isArray(s) || s.length !== 2 || s.some(n => !Number.isInteger(n) || n < 0 || n > 99))) {
          return Response.json({ ok: false, error: "Invalid match or scores." }, { status: 400 });
        }
        const target = String(env.SCORE_WRITE_URL);
        if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(target)) throw Error("Invalid write endpoint");
        const upstream = await fetch(target, {
          method: "POST",
          headers: { "content-type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({
            secret: String(env.SCORE_WRITE_SECRET),
            group: input.group, p1: input.p1, p2: input.p2, scores: input.scores
          }),
          redirect: "follow"
        });
        const text = await upstream.text();
        let result;
        try { result = JSON.parse(text); } catch { throw Error("Google Sheets write endpoint returned an unexpected response"); }
        if (!upstream.ok || !result.ok) {
          return Response.json({ ok: false, error: result.error || "Google Sheets could not save the match." }, { status: upstream.ok ? 400 : 502 });
        }
        return Response.json({ ok: true, winner: result.winner, setScore: result.setScore }, { headers: { "cache-control": "no-store" } });
      } catch (e) {
        return Response.json({ ok: false, error: String(e.message || e) }, { status: 400 });
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
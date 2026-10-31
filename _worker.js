const SHEET_ID = "1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI";
const ALLOWED = new Set(["Groups", "Schedule", "Results recording", "Standing", "Announcements"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return new Response("ok", { headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    if (url.pathname === "/api/sheet") {
      const sheet = url.searchParams.get("sheet") || "";
      if (!ALLOWED.has(sheet)) return new Response("Invalid sheet", { status: 400 });

      const googleUrl =
        "https://docs.google.com/spreadsheets/d/" + SHEET_ID +
        "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(sheet);

      try {
        const upstream = await fetch(googleUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
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
            "cache-control": "no-store"
          }
        });
      } catch {
        return new Response("Could not reach Google Sheets", { status: 502 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
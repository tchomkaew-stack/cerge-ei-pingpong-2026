const SHEET_ID = "1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI";
const ALLOWED = new Set(["Groups","Schedule","Results recording","Standing"]);

export async function onRequestGet(context) {
  const reqUrl = new URL(context.request.url);
  const sheet = reqUrl.searchParams.get("sheet") || "";
  if (!ALLOWED.has(sheet)) {
    return new Response("Invalid sheet", { status: 400 });
  }

  const googleUrl =
    "https://docs.google.com/spreadsheets/d/" + SHEET_ID +
    "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(sheet);

  try {
    const upstream = await fetch(googleUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cf: { cacheTtl: 0, cacheEverything: false }
    });

    const body = await upstream.text();

    if (!upstream.ok) {
      return new Response(
        "Google Sheets returned " + upstream.status,
        { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.includes("text/csv") && body.trim().startsWith("<")) {
      return new Response(
        "Google Sheet is not anonymously readable. Set General access to Anyone with the link → Viewer.",
        { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  } catch (err) {
    return new Response("Could not reach Google Sheets", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
}

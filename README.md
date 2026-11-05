# CERGE-EI Ping Pong League 2026

Public tournament hub for the CERGE-EI Ping Pong League 2026.

## Live data
The site reads these Google Sheet tabs:
- Groups
- Schedule
- Results recording
- Standing

Google Sheet ID:
`1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI`

For live data to work, the sheet must be shared as:
**Anyone with the link → Viewer**

Do not make the public link editable.

## Tournament structure
- 7 groups × 6 players
- Round robin: 5 matches per player
- Ranking: Wins → Win Rate → Set Ratio → Point Differential
- Minimum 3 completed matches for knockout eligibility
- Top 2 eligible players from each group = 14
- Best 2 eligible third-place finishers = 2 wild cards
- 16-player knockout
- Forfeits count as a match win/loss, but add no artificial sets or points

## Hosting and updates
The live website is deployed with **Cloudflare Pages** from the connected GitHub repository: https://cerge-ei-pingpong-2026.pages.dev/.

- The Cloudflare Worker reads public Google Sheets data through `/api/sheet`.
- Participants can submit and correct scores **without login or PIN** when the Apps Script integration is configured. See [score-writing setup](integrations/README-score-write.md).
- Apps Script is a separate Google deployment: updating `Code.gs` in GitHub does **not** deploy it to Google. The sheet owner must deploy a new Apps Script version.
- Ranking ties that remain unresolved after all published criteria require the Sports Representative's decision; the website does not break them alphabetically.
- Run regression checks with `node --test tests/league.test.cjs`.

**Data-integrity note:** The built-in fallback schedule currently contains a duplicated Group C pairing (Marek Kapička vs Michael Schulz) and omits Caner Kilic vs Marek Kapička. Confirm and correct the authoritative Google Sheet if it has the same issue; do not assume the fallback is authoritative.

# Enable score recording directly from the existing tournament website

This feature is already implemented in the live website source:
- Players open **Record Score** on the existing `pages.dev` site.
- They select a match, enter up to five game scores, and provide a shared tournament PIN.
- The site's `POST /api/submit-score` endpoint validates the request and sends it to Google Apps Script.
- The Apps Script locates the existing row in the **Results recording** sheet and updates only **G:K** (game scores) and **L** (winner). **M** (set-score formula) and the existing Standing formulas are preserved.
- The front end refreshes the standings from Google Sheets.

## One-time setup: organizer access needed

**Step 1 — Create Apps Script**

1. Open the existing [tournament Google Sheet](https://docs.google.com/spreadsheets/d/1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI/edit).
2. Select **Extensions → Apps Script**.
3. Replace the editor's `Code.gs` with the contents of [Code.gs](./google-apps-script/Code.gs) in this repository.
4. Open **Project Settings → Script Properties**. Create `SCORE_WRITE_SECRET` with a long randomly generated secret (minimum 32 random characters).
5. Choose **Deploy → New deployment → Web app**. Execute as **Me** (the spreadsheet owner), access **Anyone**. Apps Script will request authorization to edit the sheet; review and approve it.
6. Copy the Web app URL ending in `/exec`. Do not use the editor URL or `/dev` URL.

**Step 2 — Configure Cloudflare Pages secrets**

Open Cloudflare Dashboard → Workers & Pages → `cerge-ei-pingpong-2026` → **Settings → Variables and Secrets** (menu names may vary). Add the following **Production** environment variables, preferably as **Secret**:

- `SCORE_WRITE_URL` = the Apps Script Web App `https://script.google.com/macros/s/.../exec` URL.
- `SCORE_WRITE_SECRET` = **exactly the same** random secret in Google Apps Script's Script Properties.
- `SCORE_ENTRY_PIN` = an independently chosen PIN/password to share privately with tournament participants. Do not place this PIN in source code.

Trigger a new Pages deployment so the Worker receives those variables.

**Step 3 — Test without affecting a played match**

Use a real *unplayed* match with both players' consent or make a temporary copy of the spreadsheet and configure its ID for the test. Enter a legitimate best-of-five result, with each game's scores in Player 1 / Player 2 order. Verify the correct Google Sheet row is updated, the formula in M remains intact, and the site refreshes standings. Do **not** use an already-recorded match to test: duplicate submissions are blocked by design.

## Important protections and caveats

- Until all three Cloudflare settings exist, the website disables direct submissions and tells participants to continue recording in Google Sheets.
- Users must know the submission PIN. **A shared PIN is only basic access control, not individual player authentication.** Anyone with the PIN could submit a result for another match, so participants should keep it private. For higher security, add real authentication and an admin correction workflow.
- Existing results cannot be overwritten through the website. If a correction is needed, ask the Sports Representative to change it in Google Sheets.
- The Apps Script performs independent score validation and rejects incomplete and duplicate results. It locks the script around writes to reduce concurrent-edit collisions.
- Do not publish the secret, commit it to GitHub, or expose the Apps Script Web App URL as a player-facing link.
- The site's URL, scheduling workflow, and read-only Google Sheets API remain unchanged.

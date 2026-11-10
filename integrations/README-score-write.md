# Score recording and rescheduling — friendly tournament, no player PIN

Participants can record a new result, correct an existing result, or record a forfeit from **Record Score**, and change a mutually agreed match date/time from **Change Schedule**, on the existing Cloudflare Pages website. **No participant account, PIN, or organizer approval is required.** The confirmation dialog prevents accidental overwrites.

## Architecture
- Cloudflare Pages Worker `POST /api/submit-score` validates a best-of-five match and forwards to the Apps Script.
- `POST /api/reschedule` uses the **same server-only Apps Script endpoint and secret**, with `action: "reschedule"`. It validates the new date and time and identifies the match by group and both player names, regardless of player order.
- Apps Script updates **Schedule!B:C and Results recording!B:C** (Date and Time) for the same group/player pair. It preserves Week, Group, player names, recorded game scores, winner, and all other columns. It checks that both match rows exist before writing, attempts rollback on write failure, and appends to **Schedule change history**.
- The Worker and Apps Script share a **server-side-only** `SCORE_WRITE_SECRET`. Participants never see or enter it.
- The bound Apps Script independently validates scores, checks that the match exists in **Results recording**, locks concurrent writes, and updates columns **G:K** (game scores) and **L** (winner). It does **not** overwrite the set-score formula in **M**.
- Forfeits are recorded in a named **Forfeit (Y/N)** column, created at the end of the sheet if absent. A forfeit awards a win/loss but no games or points.
- Every web submission sets **Last updated** and appends the old/new values to **Result change history** (a new tab created if needed). Existing scores may be replaced by another submission.

## Important Web App fix

The Apps Script Web App must open the tournament spreadsheet explicitly with `SpreadsheetApp.openById(...)`. Do **not** use `SpreadsheetApp.getActiveSpreadsheet()` in the deployed Web App: Google's bound-script “active document” methods are not available in Web App execution context.

If an older deployment still contains `getActiveSpreadsheet()`, both **Record Score** and **Change Schedule** can fail even though the script is correctly bound to the tournament spreadsheet.

## Activation after adding website rescheduling

**Required even if score recording already works:** update the existing bound Google Apps Script to the latest repository `Code.gs`, then create a **new Web App deployment version**. GitHub updates alone do not update the running Google Apps Script. The existing Cloudflare secret and Apps Script URL can be reused; **no second PIN, account, or secret is needed**.

## One-time deployment (requires spreadsheet owner)
1. Open [the tournament spreadsheet](https://docs.google.com/spreadsheets/d/1tbDsjuuQhpLPLtzR5w14DlT-D1HK4slx4iFtcWjfhyI/edit) and select **Extensions → Apps Script**.
2. Replace the bound script's `Code.gs` with [the repository's current Code.gs](./google-apps-script/Code.gs). **Saving this GitHub file alone does not update an already deployed Apps Script.**
3. In **Project Settings → Script Properties**, set `SCORE_WRITE_SECRET` to a strong random secret.
4. **Deploy → Manage deployments → Edit → New version → Deploy** (or deploy a new Web App). Execute as the spreadsheet owner, access **Anyone**. Confirm authorization.
5. In Cloudflare Pages production **Variables and Secrets**, set `SCORE_WRITE_URL` to the deployed Apps Script `/exec` URL and `SCORE_WRITE_SECRET` to the matching secret. Redeploy if needed.
6. **No `SCORE_ENTRY_PIN` is required.** Remove any obsolete PIN setting if one exists.

## Test carefully
Use a copy of the sheet or a mutually agreed test match, not an arbitrary completed match. Verify new scores, correction, and forfeit; check that the formula in column M remains intact, that the new flag and timestamp columns exist, and that **Result change history** records both versions. Then verify the public site refreshes its standings. Also test changing an unplayed fixture date/time from the website and verify **Schedule!B:C** and **Results recording!B:C** changed to the same date/time, **Schedule change history** logged both previous values, and all recorded game scores and winners stayed unchanged. Manual edits to one tab do not automatically synchronize the other. Revert test data if using a real match.

## Important
This is intentionally a trust-based, small community tournament. Anyone who can reach the public submission endpoint could submit or correct a result, even without a PIN. Server-side validation protects the *format* and consistency of submissions, **not the identity of the submitter**. Keep the site URL within the community where practical. The organizer can use the change-history tab to review mistakes.

Until the Worker is configured and the new Apps Script deployment is active, participants can continue using the Google Sheet directly. Changes in GitHub alone cannot activate the updated Apps Script.

# SmartSpend frontend fixes

- Moved authenticated pages under one persistent `AppLayout`; the header and shared page container no longer remount for every page.
- Reused the `/users/me` request across the header, dashboard and transaction history, and added in-flight GET deduplication for identical requests (including React StrictMode development replays).
- Connected the Add Transaction datetime input to the form state and used the same explicit Asia/Kolkata wall-clock conversion for its default value and maximum.
- Preserved the originating page when opening Add Transaction from Dashboard or Transaction History; back, cancel and successful save return to that page.
- Standardised the authenticated content container width and responsive horizontal padding.

Build verification could not be completed in this environment because frontend npm dependencies could not be fully installed. Run `npm ci`, `npm run build`, and `npm run lint` locally.


## Follow-up API request cleanup

- Added shared in-flight and in-memory caching for category-list requests (including separate caches for all categories and filtered category types).
- Removed the category-list request from Transaction Details; it now uses the transaction response's category data and falls back to the standard category icon when the detail response does not include an icon.
- Removed the unused current-user request from the Dashboard hook.
- Reused the same `/users/me` request/cache for preferences and the persistent application header, avoiding the login-to-layout duplicate request.
- Removed post-save category-list reloads after successful category edits and creations; local category state is updated instead.
- Category edits now send PATCH only when category fields changed and send the budget PUT/DELETE only when the monthly limit changed.
- Category cache is invalidated after category mutations and logout so stale data is not reused.

The frontend build could not be completed in the packaging environment because dependency installation timed out and left `node_modules` incomplete. Please run `npm ci`, then `npm run build` and `npm run lint` locally. Reapply the Zod security update in this extracted copy with `npm install zod@^4.6.7` before the audit/build checks.

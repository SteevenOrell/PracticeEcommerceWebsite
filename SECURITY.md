# Security notes

This is a portfolio/demo storefront. It is **not** production-ready for real customers,
real payments or real personal data. The items below need a human decision and, for the
backend items, server-side work. A frontend change cannot fix them.

## Open items that need backend / account changes

| Severity | Issue | Recommended fix |
|---|---|---|
| Critical | The MockAPI project (`/users`, `/products`) is public and unauthenticated. Anyone can **read every user record (including a `password` field)**, and can create, edit or delete users and products. | Rotate/clear all stored passwords and stop storing passwords there (Firebase Auth already owns credentials). Delete the `password` column from the MockAPI `users` resource. Move user/admin data behind a real API (e.g. Firebase Functions / Supabase / a small Node API) that verifies the Firebase ID token and enforces roles server-side. Keep MockAPI read-only for products, or replace it. |
| High | Admin access is decided in the browser (custom claim, or legacy `VITE_ADMIN_EMAIL` match). Client checks can be bypassed in devtools, and the admin email is embedded in the JS bundle. | Set a Firebase custom claim (`admin: true`) with the Admin SDK and enforce it in the backend for every admin operation. Then remove `VITE_ADMIN_EMAIL`. |
| High | The public README publishes a test account email and password. | Remove the credentials from the README, change that account's password in Firebase, and share demo access privately (or provide a read-only demo mode). Git history still contains the old README, so treat that password as burned. |
| Medium | Prices and the order total are computed client-side, and checkout is simulated. | Any real checkout must price items server-side and use a hosted, PCI-compliant payment element (e.g. Stripe Checkout in test mode). Never collect raw card numbers in app inputs. |
| Medium | The Firebase web API key is public by design. | In Google Cloud, restrict the key to HTTP referrers (`ecom-web-practice.vercel.app`, `localhost`). In Firebase Auth, keep **Authorized domains** to the production and preview domains only. Enable email enumeration protection. |
| Low | Firebase Auth persists the session in IndexedDB (`browserLocalPersistence`). Any XSS could use it. | Acceptable for a demo given the CSP. For stricter setups, use `browserSessionPersistence`. |
| Low | `react-router` <7.18 has moderate advisories (backslash open-redirect in `<Link>`/`navigate`, and an SSR-only issue). This app only navigates to internal, encoded paths and does not use SSR. | Plan an upgrade to React Router v7. |
| Low | `@nextui-org/*` is deprecated (renamed HeroUI) and flagged low-severity through `@nextui-org/theme`. | Migrate to `@heroui/react` when convenient. |

## Frontend mitigations in place

- Users API client allow-lists writable fields. Passwords are never sent, and `password` is stripped from responses before reaching UI state.
- Profile page only updates the signed-in user's Firebase display name. Role, email and password are not editable, and password changes use Firebase's reset email.
- Route params are validated and URL-encoded before API calls and links.
- Avatar URLs from the API are restricted to http(s).
- Checkout is clearly labelled as a demo, card fields are not autofilled, and they are wiped on submit.
- The app no longer crashes when Firebase env vars are missing. Auth features are disabled instead.
- `axios`, `react-router-dom` and `firebase` were upgraded within their major versions to clear the known high-severity advisories.
- `vercel.json` sets a Content-Security-Policy plus `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP (`same-origin-allow-popups`, needed for Google popup sign-in) and HSTS. If you add a new third-party origin (analytics, CDN, Stripe), you must allow it in the CSP.
- Fonts are self-hosted (`@fontsource`), so the CSP does not need a third-party font CDN.
- The CRA toolchain (`react-scripts`) was replaced by Vite. This removed the large set of build/dev-server `npm audit` findings.

## Reporting

Please report vulnerabilities privately to the repository owner rather than opening a public issue.

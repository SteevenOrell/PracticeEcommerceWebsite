# Security notes

This is a portfolio/demo storefront. It is **not** production-ready for real customers,
real payments or real personal data. The items below need a human decision and, for the
backend items, server-side work. A frontend change cannot fix them.

## Open items that need backend / account changes

| Severity | Issue | Recommended fix |
|---|---|---|
| Resolved (after deploy) | The app used a public, unauthenticated MockAPI project for `/users` and `/products`. Anyone could read every user record and create, edit or delete users and products. | Data moved to Firestore, protected by [`firestore.rules`](firestore.rules): products are public-read and admin-write; users are admin-only; every other path is denied. Writes are shape-validated, so even an admin can't store passwords, bad emails, non-https avatars or extra fields. The app no longer calls MockAPI. **Owner action:** once Firestore is live, delete (or empty) the MockAPI project, because it stays writable for as long as it exists. |
| Resolved | Admin access was decided in the browser (custom claim, or a `VITE_ADMIN_EMAIL` match), and the admin email shipped in the JS bundle. | Admin is now only the `admin: true` Firebase custom claim, set server-side with `npm run firebase:set-admin`. Firestore rules check the same claim, so bypassing the UI check in devtools gives no data access. `VITE_ADMIN_EMAIL` was removed. |
| Resolved | The public README published a shared test account email and password. | The account was deleted from Firebase and the README now describes guest/Google sign-in for standard (read-only) access, with admin access granted on request. Git history still contains the old README, but that account no longer exists. |
| Medium | Prices and the order total are computed client-side, and checkout is simulated. | Any real checkout must price items server-side and use a hosted, PCI-compliant payment element (e.g. Stripe Checkout in test mode). Never collect raw card numbers in app inputs. |
| Medium | The Firebase web API key is public by design. | In Google Cloud, restrict the key to HTTP referrers (`ecom-web-practice.vercel.app`, `localhost`). In Firebase Auth, keep **Authorized domains** to the production and preview domains only. Enable email enumeration protection. |
| Low | Firebase Auth persists the session in IndexedDB (`browserLocalPersistence`). Any XSS could use it. | Acceptable for a demo given the CSP. For stricter setups, use `browserSessionPersistence`. |
| Low | `react-router` <7.18 has moderate advisories (backslash open-redirect in `<Link>`/`navigate`, and an SSR-only issue). This app only navigates to internal, encoded paths and does not use SSR. | Plan an upgrade to React Router v7. |
| Low | `@nextui-org/*` is deprecated (renamed HeroUI) and flagged low-severity through `@nextui-org/theme`. | Migrate to `@heroui/react` when convenient. |

## Frontend mitigations in place

- Firestore security rules are covered by emulator tests (`npm run test:rules`): guests and members can't write anything, users are admin-only, forged non-boolean claims are rejected, and malformed documents are refused.
- The service-account key used by the Admin SDK scripts is read from `GOOGLE_APPLICATION_CREDENTIALS` (a path outside the repo) and is never bundled or committed.
- Users API client allow-lists writable fields. Passwords are never sent, and `password` is stripped from responses before reaching UI state.
- Profile page only updates the signed-in user's Firebase display name. Role, email and password are not editable, and password changes use Firebase's reset email.
- Route params are validated and URL-encoded before API calls and links.
- Avatar URLs from the API are restricted to http(s).
- Checkout is clearly labelled as a demo, card fields are not autofilled, and they are wiped on submit.
- The app no longer crashes when Firebase env vars are missing. Auth features are disabled instead.
- `axios` was removed (no REST API any more); `react-router-dom` and `firebase` were upgraded within their major versions to clear the known high-severity advisories.
- `vercel.json` sets a Content-Security-Policy plus `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP (`same-origin-allow-popups`, needed for Google popup sign-in) and HSTS. If you add a new third-party origin (analytics, CDN, Stripe), you must allow it in the CSP.
- Fonts are self-hosted (`@fontsource`), so the CSP does not need a third-party font CDN.
- The CRA toolchain (`react-scripts`) was replaced by Vite. This removed the large set of build/dev-server `npm audit` findings.

## Reporting

Please report vulnerabilities privately to the repository owner rather than opening a public issue.

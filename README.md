# React Ecommerce App

**Live:** https://ecom-web-practice.vercel.app/

This is a full-stack CRUD ecommerce application built with React, React Router, Firebase Auth and Cloud Firestore.

---

## Features

### Navigation
- Responsive navbar with mobile menu toggle
- Search overlay showing top 4 live results
- Cart icon with item count badge
- User profile dropdown (email, account links, logout)

### Landing Page
- Hero section with auto-playing video (separate mobile/desktop versions)
- Featured products carousel with prev/next arrows and pagination dots
- Lifestyle image grid section

### Product Listing
- Product grid (9 items per page, 2–3 column layout)
- Pagination with scroll-to-top on page change
- Filter by color and size (dynamic dropdowns)
- Sort by price (high to low / low to high)
- Active filter indicators and reset button
- "Product not found" state with support link

### Product Detail
- **Mobile:** touch-swipe image carousel with arrow buttons and dot indicators
- **Desktop:** 4-image gallery layout
- Size selector, quantity control, star rating display
- Add to Cart button

### Shopping Cart
- Slide-in cart sidebar (closes on backdrop click)
  - Per-item quantity controls and remove button
  - Subtotal, View Cart, and Checkout links
- Full cart page with line-item totals, order summary, and free shipping display

### Checkout
- Contact, shipping, and payment form sections
- Live order summary with dynamic "Pay $X.XX" button
- Success page with auto cart-clear on completion

### Authentication & Accounts
- Login / logout with session persistence
- Edit profile page (protected route)
- Role-based access: standard user vs. admin

### Admin (protected)
- View all users
- Add, edit, and delete users

---

## Tech Stack

- **React 18** — UI and component logic
- **React Router v6** — client-side routing and protected routes
- **Context API** — cart, user, and search state
- **Firebase Auth + Cloud Firestore** — sign-in, product catalog and admin-only user records, protected by [security rules](firestore.rules)
- **Tailwind CSS** — utility-first styling
- **NextUI / Headless UI** — accessible UI primitives
- **Framer Motion** — animations
- **Font Awesome / Heroicons** — icons
- **Vercel** — deployment
- **Vite** — dev server and build (migrated from Create React App)
- **Vitest + Testing Library** — unit tests; **Playwright** — portfolio screenshots/video

---

## Local development

Requires Node.js 20.19+.

```bash
npm ci
cp .env.example .env.local   # fill in your Firebase web config (optional: without it the store shows the bundled catalog and sign-in is disabled)
npm run dev                  # http://localhost:3000
npm run build && npm run preview
npm test                     # unit tests
npm run test:rules           # Firestore security-rules tests (starts the emulator; needs Java 11+)
npm run lint
npm run media                # optional: screenshots + walkthrough video (needs a running dev/preview server)
```

Environment variables use the `VITE_` prefix (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
`VITE_FIREBASE_APP_ID`, optional `VITE_USE_FIREBASE_EMULATOR`). Every `VITE_*` value is public in the
browser bundle, so never put secrets in them. See [SECURITY.md](SECURITY.md) for the security model.

> **Windows tip:** if the Firestore emulator exits with `Unable to establish loopback connection`, set
> `JAVA_TOOL_OPTIONS=-Djdk.net.unixdomain.tmpdir=C:\Users\<you>\.jdkuds` (any short folder that exists) and retry.

### Firebase setup (one-time)

1. In the Firebase console, create a **Cloud Firestore** database (production mode). Under **Authentication**, enable the **Google** provider.
2. Deploy the security rules: `npx firebase login`, then `npx firebase use <project-id>`, then `npm run firebase:deploy-rules`.
3. Create a service-account key (**Project settings > Service accounts > Generate new private key**). Save it **outside this repo** and point to it:
   `GOOGLE_APPLICATION_CREDENTIALS=C:\path\outside\repo\key.json`.
4. Copy the demo data in: `npm run firebase:seed`. This copies products from `src/data/products.json` and users from the old MockAPI project, never including passwords. Add `-- --dry-run` to preview it first.
5. Make yourself admin: sign in once on the site, then run `npm run firebase:set-admin -- you@example.com`, then sign out and back in.
   Grant or revoke testers the same way (`--revoke`; `--list` shows current admins).
6. Delete the old MockAPI project. The app no longer uses it, and it stays publicly writable for as long as it exists.

---

## Trying the demo

There is no shared test account. Two levels of access are available:

| Access | How to get it | What you can do |
|---|---|---|
| **Guest** | Just open the [live site](https://ecom-web-practice.vercel.app/) | Browse products, search, filter, add to cart, and walk through the demo checkout |
| **Standard member** | On the sign-in page, choose **Continue with Google** | Everything a guest can do, plus the account menu and your own profile name/avatar. Members can't create, edit or delete products or users. |
| **Admin** | Contact me on LinkedIn and I'll grant access to your account | The user management screens (view, add, edit and delete demo users) |

**Please note:**
- All products and users are fake demo data. The checkout is a demo: **never enter a real card number**.
- Your Google name, email and photo are used only to show your account in the app's menu. They aren't written to the database.
- Access is enforced by Firestore security rules on the server, not just hidden in the UI.
- The demo data may be reset from time to time.

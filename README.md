# React Ecommerce App

**Live:** https://ecom-web-practice.vercel.app/

A full-stack CRUD ecommerce application built with React, React Router, and a REST API.

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
- **Axios** — REST API communication
- **Tailwind CSS** — utility-first styling
- **NextUI / Headless UI** — accessible UI primitives
- **Framer Motion** — animations
- **Font Awesome / Heroicons** — icons
- **Vercel** — deployment

---

## Test Account

| Field | Value |
|---|---|
| Email | test@gmail.com |
| Password | test123 |

> Contact me on LinkedIn to test admin features.

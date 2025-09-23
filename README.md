# Ramona Jewels Frontend (Next.js)

This is the Next.js app for the Ramona Jewels e‑commerce platform.

## Getting Started

1) Install dependencies
```bash
npm install
# or
yarn
```

2) Configure environment
Create .env.local in project root with:
```
NEXT_PUBLIC_API_URL=http://backend.com/api/v1
# Optionally
# NEXT_PUBLIC_STRIPE_PK=pk_...
# NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
```

3) Run the development server
```bash
npm run dev
# or
yarn dev
```
Then open http://localhost:3000

## Features
- Product catalog, filters, search
- Auth (email/password and social)
- Cart and checkout (Stripe/PayPal)
- Reviews with real‑time updates
- Admin dashboard and inventory
- Homepage testimonials fetch 3 random reviews from the backend

## Build & Start
```bash
npm run build && npm start
```

## Notes
- Ensure the backend server is running at NEXT_PUBLIC_API_URL
- Image domains configured in next.config.ts must match backend/CDN hosts

## Documentation
- Full docs live in the sibling docs/ folder.
- To generate the DOCX file:
  1) cd ../docs
  2) npm install
  3) npm run generate-docx
- The output will be created at docs/Ramona-Jewels-Documentation.docx

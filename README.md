# Feedback Management System (React + Vite)

Customers submit feedback; admins triage it and track it to resolution.
Built with **React + Vite**. Accounts and feedback are stored in
**localStorage** (no backend).

## Modules
- **User Module** — sign up / log in, submit feedback (category, 1–5 stars, comment), view own submissions and their status.
- **Admin Module** — dashboard with search + filters, feedback detail (change status, internal notes), analytics (stats + charts).

## Run locally
```bash
npm install
npm run dev        # open the URL it prints (usually http://localhost:5173)
```

## Logins
- **Admin (seeded automatically):** `admin` / `admin123`
  — change it in `src/lib/storage.js` (`DEFAULT_ADMIN_USERNAME` / `DEFAULT_ADMIN_PASSWORD`).
- **User:** click **Sign Up** and create any account.

## How login / signup works (localStorage)
`src/lib/storage.js` keeps accounts under the `fms_users` key and feedback
under `fms_feedback`. `sessionStorage` holds who is logged in for the
current tab. `src/components/ProtectedRoute.jsx` guards every page:
not logged in → `/login`; wrong role → sent to that role's own home.
After login, the role decides the destination (admin → `/admin`, user → `/feedback`).

Note: because localStorage lives in each browser, data created on one
device/browser is not visible on another. Passwords are stored in plain
text — acceptable for a coursework demo, not for a real product.

## Project structure
```
src/
├── main.jsx, App.jsx          router + route guards
├── context/AuthContext.jsx    login / signup / logout state
├── lib/storage.js             all localStorage logic
├── components/                Navbar, ProtectedRoute, StarRating, PulseStrip, StatusBadge
└── pages/
    ├── Login.jsx, Signup.jsx
    ├── user/                  FeedbackForm, MyFeedback
    └── admin/                 Dashboard, FeedbackDetail, Analytics
vercel.json                    rewrites all paths to index.html (needed for React Router)
```

## Deploy to Vercel
1. Push this folder to a GitHub repository (steps below).
2. Go to vercel.com → **Add New → Project** → import the repository.
3. Vercel detects Vite automatically (Build: `npm run build`, Output: `dist`). Click **Deploy**.
4. Open the generated `*.vercel.app` link and test sign up, login, and both modules.

## Push to GitHub
```bash
git init
git add .
git commit -m "Feedback Management System - React + Vite"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

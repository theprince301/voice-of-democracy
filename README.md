# Voice of Democracy

A full-stack MERN news website with role-based access control (admin / editor / reader).

## Stack
- **MongoDB** + Mongoos
- **Express** + Node.js — REST API
- **React** (Vite) + Tailwind CSS — frontend
- **JWT** — authentication

## Features
- Public article feed with search, category filters, and pagination
- Article detail page with view counter and comments
- Role-based auth:
  - **admin** — manage all articles and categories, promote staff accounts
  - **editor** — create/edit/delete their own articles, save as draft or publish
  - **reader** — default role on signup; can comment on articles
- Draft / Published workflow for articles
- Comments (any logged-in user can post; owner or admin can delete)

## Project structure
```
voice-of-democracy/
  backend/     Express API (MongoDB via Mongoose)
  frontend/    React app (Vite + Tailwind)
```

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI (local MongoDB or Atlas) and a strong JWT_SECRET
npm install
npm run dev          # starts on http://localhost:5000
```

Seed an initial admin account and starter categories (Politics, World, Business, etc.):
```bash
npm run seed
```
This creates `admin@voiceofdemocracy.com` / `ChangeMe123!` by default. Override with
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars before running. **Log in and change
the password immediately if this goes anywhere near production.**

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # points VITE_API_URL at your backend
npm install
npm run dev             # starts on http://localhost:5173
```

### 3. Use it
1. Visit http://localhost:5173
2. Log in as the seeded admin (`admin@voiceofdemocracy.com`)
3. Create editor/admin accounts via `POST /api/auth/create-staff` (admin-only endpoint —
   there's no UI for this yet, so use curl/Postman, or build a small admin form)
4. From **Dashboard**, click **+ New Article** to write and publish stories
5. Anyone can register as a reader and comment on published articles

## API overview
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public (creates a `reader`) |
| POST | `/api/auth/login` | Public |
| GET  | `/api/auth/me` | Logged in |
| POST | `/api/auth/create-staff` | admin only (creates editor/admin accounts) |
| GET  | `/api/articles` | Public — published only. Supports `?search=`, `?category=`, `?tag=`, `?page=`, `?limit=` |
| GET  | `/api/articles/:slug` | Public (increments view count) |
| GET  | `/api/articles/admin` | admin, editor — all statuses |
| POST | `/api/articles` | admin, editor |
| PUT / DELETE | `/api/articles/:id` | admin, or editor who owns the article |
| GET | `/api/categories` | Public |
| POST / DELETE | `/api/categories/:id` | admin |
| GET | `/api/comments/:articleId` | Public |
| POST | `/api/comments` | Logged in |
| DELETE | `/api/comments/:id` | Owner or admin |

## Notes & next steps
- Article `content` is stored as plain text/whitespace-preserved. Swap in a rich text
  editor (TipTap, Quill) in `ArticleForm.jsx` for a nicer authoring experience — sanitize
  any HTML output before rendering if you do.
- Cover images currently use plain URLs — wire up file uploads (Cloudinary, S3) for direct
  uploads.
- Add `helmet` and `express-rate-limit` before deploying publicly.
- Add a small admin UI for creating staff accounts and managing categories, rather than
  relying on the raw API endpoints.
- Consider SSR or static generation if SEO matters for breaking news content.

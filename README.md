# MoodBuds — combined project (frontend + backend)

Everything in one place: your `moodbuds-frontend` (with all admin catalog
changes applied) and your `moodbuds-apis` backend (unmodified, included
as-is for convenience — I only read it, never changed it).

```
.
├── frontend/     moodbuds-frontend, with this session's changes applied
├── backend/      moodbuds-apis, exactly as you uploaded it (+ Dump20260913/)
└── CHANGES.md    what changed in the frontend, and why
```

## Run it

**Backend** (from `backend/`):
```
$env:MOODBUDS_DB_PASSWORD = '<your local MySQL password>'
$env:MOODBUDS_JWT_SECRET = '<32+ char random secret>'
mvn spring-boot:run
```
Needs the `mb` MySQL database loaded from `Dump20260913/`, and at least
one row in `admin_users` — see the "Insert the first super admin" section
further down in this backend's own README if you haven't done that yet.

**Frontend** (from `frontend/`):
```
npm install
npm run dev      # app at http://localhost:5173
npm test         # run the test suite (51 tests)
```
`.env.local` already points `VITE_API_BASE_URL` at `http://localhost:8080/api/v1`.

Open `http://localhost:5173/profile/admin/categories` — you'll land on
the admin sign-in screen first (username/password from `admin_users`),
then the Categories page.

## What changed, and what didn't

Full details, including exactly which files are new vs. modified, the
real vs. mock data question for products, and the test suite breakdown,
are in `CHANGES.md`. Short version:

- **Categories & Subcategories** — real UI, wired to your actual
  `/api/v1/admin/categories` / `/api/v1/admin/subcategories` endpoints,
  with a dedicated admin login. Covered by 51 passing tests.
- **Create/Edit Product** — clean UI, still on mock data. Your real
  product schema (multi-mood, per-size stock, required GST rate, two-step
  media upload) is different enough that I held off rebuilding it without
  your go-ahead first.
- **Backend** — nothing changed. It's in here only so the whole project
  is in one zip as requested.

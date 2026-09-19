# Admin catalog — Categories/Subcategories (live + tested) + Create/Edit Product (UI)

Drop-in files for `moodbuds-frontend`. Copy each over the matching path,
then:

```
cd frontend
npm install       # picks up the new test dependencies in package.json
npm run dev       # run the app (needs backend at localhost:8080 + an admin_users row)
npm test          # run the test suite
```

## Test suite — added this round

Set up Vitest + React Testing Library (`jsdom` environment) since the repo
had no test tooling yet. `npm test` runs `vitest run` (single pass, CI-style,
exits non-zero on failure). `npm run test:watch` for local dev.

**Result, run twice in a row to rule out flakiness: 51/51 passing both times.**

```
 ✓ src/data/admin.test.ts                                  (5 tests)
 ✓ src/features/admin/services/adminApiClient.test.ts       (9 tests)
 ✓ src/features/admin/services/adminAuthService.test.ts     (3 tests)
 ✓ src/features/admin/services/catalogAdminApi.test.ts     (13 tests)
 ✓ src/features/admin/components/AdminLoginGate.test.tsx    (3 tests)
 ✓ src/features/admin/components/ProductForm.test.tsx       (8 tests)
 ✓ src/features/admin/pages/CategoryPages.test.tsx         (10 tests)

 Test Files  7 passed (7)
      Tests  51 passed (51)
```

### What's covered, and why

- **`data/admin.test.ts`** — `slugify()`: spacing, punctuation, repeated
  separators, leading/trailing hyphens, empty input. This is the exact
  function used to generate the slug sent to your backend, so its edge
  cases matter.
- **`adminApiClient.test.ts`** — the token manager (separate from the
  customer `apiClient`'s storage key), that the `Authorization: Bearer`
  header is attached only when signed in, JSON body serialization on
  POST/PATCH, that a 401 clears the stored token (forcing re-login), that
  backend `detail` messages surface as the error text, and 204 responses
  resolve to `undefined` rather than trying to parse an empty body as JSON.
- **`adminAuthService.test.ts`** — successful login stores the token +
  admin summary; a failed login (401) stores nothing; `logout()` clears
  the session.
- **`catalogAdminApi.test.ts`** — the highest-value file, since it's the
  translation layer to your real schema:
  - DB rows (`is_active`, `category_id`, nullable `slug`) map correctly
    to the UI's `AdminCategory`/`AdminSubcategory` shapes.
  - `is_active` is handled whether MySQL/JDBC returns it as a JS boolean
    or as `0`/`1` (both happen depending on driver config, so I test both).
  - Product/subcategory counts are computed correctly by grouping the
    fetched products by `category_id`/`subcategory_id`.
  - Multi-page pagination is actually exercised (a 2-page response,
    asserting both `page=0` and `page=1` requests happen).
  - If the `/admin/products` call fails (e.g. a role without
    `catalog.read`), category listing still succeeds with counts at 0
    instead of the whole page breaking — this was a deliberate
    `.catch()` in the code, now it's pinned by a test.
  - Create/update/delete send exactly the payload shape your
    `AdminCrudService` expects (`isActive` boolean, `categoryId` as a
    number, not a string).
- **`AdminLoginGate.test.tsx`** — empty-field validation blocks the API
  call, a 401 shows "Invalid username or password", a successful login
  calls `onSignedIn`.
- **`CategoryPages.test.tsx`** — the actual user flows end to end against
  a mocked `catalogAdminApi`: loading state → rendered cards, a load
  failure surfaces as a toast, empty-name validation blocks creation,
  creating a category posts the right payload and reloads the list, the
  Active/Draft toggle rolls back on API failure (optimistic update with
  correct error recovery), the deactivate confirm-dialog flow removes the
  card from view, subcategory search filtering, and the "parent category
  required" validation on the subcategory form.
- **`ProductForm.test.tsx`** — category selection resets the subcategory
  (cascading select), size chips toggle on/off and only the selected
  ones reach `onSubmit`, "Save draft" vs "Publish" pass the right boolean,
  edit mode pre-fills from the given product and locks the SKU field,
  and the delete button fires `onDelete`.

### What's intentionally not covered

No test hits your real backend or a real MySQL instance — this sandbox
can't reach Maven Central or run MySQL, so nothing here substitutes for
you smoke-testing sign-in → categories → subcategories against your
actually-running Spring Boot app. The tests confirm the frontend sends
the right requests and handles responses/errors correctly in isolation;
they can't confirm your backend's routing, auth, or SQL actually behaves
as the README says.

## Everything from the previous round is unchanged

Categories/Subcategories are wired to your real
`/api/v1/admin/categories` and `/api/v1/admin/subcategories`
(`AdminCrudController`), with a dedicated admin login/token store
separate from the customer auth. Create/Edit Product are still on mock
data — your real product schema (multi-mood, per-size stock, required
GST rate, two-step media upload) is different enough from the current
form that I held off rebuilding it without your sign-off first.

## Verified

- `npx tsc --noEmit` — no new type errors from any file in this round.
- `npx vite build` — production build succeeds.
- `npm test` — 51/51 passing, run twice for stability.

# Codebase review: DRY, modern patterns, readability, and structure

Review of the race-results app with a focus on consistency, duplication, and maintainability.

---

## 1. DRY (Don’t Repeat Yourself)

### 1.1 Form error display

**Issue:** `OrganizationInformation` and `FeatureFlagsManagement` render errors inline:

```tsx
{
    state.isError && <div className="text-red-500">{state.message}</div>;
}
```

You already have `<FormError isError={} messages={} />` in `@/app/components/forms/form-error.tsx` (and re-exported from `form.tsx`), which supports a single string. Other flows (e.g. class-groups dialogs, update-base-class-form) use `FormError`.

**Recommendation:** Use `FormError` for these two as well, e.g. `<FormError isError={state.isError} messages={state.message} />`, so all server-action form errors look and behave the same.

### 1.2 Simple action state type and initial state

**Issue:** The shape `{ isError: boolean; message: string }` and initial `{ isError: false, message: "" }` are repeated in:

- `update-org.ts` (local `ActionState` type)
- `organization-information.tsx`, `feature-flags-management.tsx`, `update-org-form.tsx` (initial state for `useActionState`)
- Tests: `update-org.test.ts`, `user.actions.test.ts`, `delete-user-button.test.tsx`

**Recommendation:** Introduce a shared type and initial value, e.g. in `src/types/forms.ts` (alongside `FormResponse`):

```ts
export type SimpleActionState = { isError: boolean; message: string };
export const INITIAL_ACTION_STATE: SimpleActionState = {
    isError: false,
    message: "",
};
```

Use these in the update-org action, the three org/feature-flags components, and in tests. That keeps one definition and makes it easier to add fields later (e.g. `pending` or a success message).

### 1.3 Date formatting in calendar

**Issue:** `calendar-tab.tsx` defines its own `formatEventDate`, `isSingleDayEvent`, and `eventDateRange`. The tenant app has `src/app/(tenants)/t/[orgSlug]/_lib/utils/date-utils.ts` with `formatDate`, `isSingleDay`, and `formatDateRange` that do similar work (display-friendly date and range).

**Recommendation:** Move shared date helpers to something like `src/lib/date-utils.ts` (or extend an existing `src/lib/date-format.ts`) and reuse them in both calendar admin and tenant code. Options: (a) calendar uses the tenant-style formatter, or (b) a shared module with a small API (e.g. `formatDisplayDate(dateOrString)`, `formatEventDateRange(start, end)`) and each route uses that. That removes duplicated parsing and locale logic.

### 1.4 `zodResolver` + Zod v4 workaround

**Issue:** Many forms use the same pattern and comment:

```ts
resolver: zodResolver(someSchema as any), // eslint-disable-next-line ...
```

**Recommendation:** Centralize the cast in one helper so the workaround lives in a single place, e.g. in `src/app/components/forms/` or `src/lib/form.ts`:

```ts
export function zodResolverCompat<T extends z.ZodType>(schema: T) {
    return zodResolver(schema as Parameters<typeof zodResolver>[0]);
}
```

Then use `zodResolverCompat(schema)` everywhere and drop the per-file `as any` and eslint-disable. When Zod/hookform types are fixed, update only this helper.

### 1.5 Dialog form flow (toast + cleanup + close)

**Issue:** Several dialogs repeat the same pattern after calling an action:

- `setError(result)` or `setError(null)`
- `toast.success(result.message)` or `toast.error(...)`
- `form.reset()`, `setError(null)`, `onOpenChange(false)` on success

Examples: create/edit class-group dialogs, create-org-dialog, create-event-dialog, create-new-season-form, link-msr-event-dialog, base-class dialogs, etc.

**Recommendation:** Consider a small hook, e.g. `useDialogFormSubmit<T>(options)` that:

- Accepts an async submit function and optional `onSuccess` / `onError`.
- Returns `{ handleSubmit, error, setError, isSubmitting }`.
- Inside the hook: call submit, then on success run `onSuccess?.(data)`, clear error, optionally call a generic “close” callback; on error set error state and optionally call `toast.error` with a normalized message (e.g. `result.errors?.[0]` or `result.message`).

Dialogs would then share one pattern and less boilerplate. This is a refactor; worth doing when touching these flows.

---

## 2. Modern and consistent patterns

### 2.1 Single source for form primitives

**Good:** You already have shared form primitives (`Form`, `FormError`, `FormInput`, `FormSelect`, `FormCheckbox`, `DefaultFormActions`, etc.) and use them in many places. Keep using them for new forms so behavior and styling stay consistent.

### 2.2 useActionState vs imperative submit + FormResponse

**Observation:** Two patterns coexist:

- **useActionState + server action:** e.g. org info, feature flags, add-org-button, user-info-form. Action returns `{ isError, message }` (or could use `SimpleActionState`).
- **useForm + async submit:** dialogs call actions directly and use `FormResponse<T>` with `errors` / `message` / `data`.

Both are valid. The main improvement is to use one shared type for the “simple” case (`SimpleActionState`) and one for the “rich” case (`FormResponse`), and to use `FormError` for both where applicable.

### 2.3 Error toasts for useActionState forms

**Observation:** Org info and feature flags no longer do their own “saved” toasts (handled by `SavedToastHandler`). They still need to show an error when the action returns `isError: true` (no redirect). Currently they only render the message in the form; they don’t call `toast.error`. If you want errors to also appear as toasts, add a small `useEffect` that calls `toast.error(state.message)` when `state.isError && state.message`, or do it inside a shared “action state feedback” helper so it’s consistent and DRY.

---

## 3. Readability and ease of modification

### 3.1 Dead or redundant code: `UpdateOrgForm`

**Issue:** The page at `admin/(organization)/(general)/page.tsx` renders `OrganizationInformation`, not `UpdateOrgForm`. `UpdateOrgForm` is only referenced in `update-org-form.test.tsx`. It’s a simpler, older variant (no header/profile images, no feature flags).

**Recommendation:** Either:

- Remove `UpdateOrgForm` and `update-org-form.test.tsx` if you don’t plan to use it, or
- If the test is meant to cover the “minimal” org form, keep the test but have it render `OrganizationInformation` with minimal props (and possibly mock image/feature-flag bits), and delete the `UpdateOrgForm` component.

That avoids maintaining two parallel org forms.

### 3.2 Calendar tab size and helpers

**Observation:** `calendar-tab.tsx` is ~210 lines and contains both UI and helpers (`formatEventDate`, `isSingleDayEvent`, `eventDateRange`). Moving the date helpers to `lib/date-utils.ts` (or similar) would shorten the file and make the tab component easier to read; the tab would only handle layout and wiring.

### 3.3 Feature flags: `formatLabel` and grouping

**Observation:** `formatLabel` (camelCase → Title Case) in `feature-flags-management.tsx` is a small, pure helper. If you use “camelCase to label” elsewhere, move it to something like `src/lib/format.ts` and reuse. If it’s only for feature flags, leaving it in the component is fine; the grouping logic is already in a `useMemo` and is clear.

---

## 4. Component breakdown and structure

### 4.1 Image uploads

**Good:** Header and profile icon uploads share `image-upload-shared.tsx` and `use-image-file-upload.ts`. Clear split between shared UI (overlay, file input, actions) and per-type components. No change needed for DRY; optional improvement would be a single config-driven component (e.g. “image upload with preset: header | profile”) if you add more image types later.

### 4.2 Dialogs

**Good:** Dialogs generally follow the same structure (Dialog, DialogContent, DialogHeader, DialogFooter, Form or custom content). Some use `DialogTrigger` + internal `open` state, others receive `open`/`onOpenChange` from the parent; both are fine. `ConfirmationDialog` gives a shared pattern for confirm/cancel. No structural change required; the main gain is the shared submit/toast/cleanup hook mentioned in 1.5 if you want less repetition inside each dialog.

### 4.3 Admin layout and feedback

**Good:** `SavedToastHandler` in the admin layout centralizes URL-based success/error toasts. Forms don’t need to know about `saved` or `error` query params. This is easy to extend (e.g. new params or messages in one place).

---

## 5. .gitignore

The project `.gitignore` is standard (deps, Next, env, Vercel, TS build info, etc.). No changes needed. If you add more tooling (e.g. a different test runner or report dir), add those entries when you introduce them.

---

## 6. Summary of suggested changes (by impact)

| Priority | Change                                                                            | Effect                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Use `FormError` in org info and feature flags forms                               | Consistent error UI and one place to style/change copy                                                                                                   |
| High     | Shared `SimpleActionState` + `INITIAL_ACTION_STATE` in `types/forms.ts`           | Single definition for action state and initial value; easier tests and future changes                                                                    |
| Medium   | Remove or repurpose `UpdateOrgForm` and align test with `OrganizationInformation` | Less dead/duplicate code and one source of truth for the org form                                                                                        |
| Medium   | Shared date helpers used by calendar and tenant code                              | Less duplication and consistent date display                                                                                                             |
| Medium   | `zodResolverCompat` (or similar) in one place                                     | _Skipped:_ a shared wrapper caused `useForm` resolver type inference to break (Resolver&lt;FieldValues&gt;). Per-file `zodResolver(schema as any)` kept. |
| Low      | Optional `useDialogFormSubmit` (or similar) for dialogs                           | Less repeated submit/toast/cleanup/close logic                                                                                                           |
| Low      | Optional: toast on action error for useActionState forms                          | Consistent feedback when server returns an error without redirect                                                                                        |

Implementing the high-priority items gives the biggest consistency and DRY win with minimal risk; the rest can be done incrementally when you touch those areas.

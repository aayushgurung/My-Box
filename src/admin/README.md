# MyBox admin frontend

The admin feature lives in `src/admin/`, separate from the public landing page in `src/App.tsx`. `src/main.tsx` selects the admin app for `/admin` and its child paths. This keeps admin components, demo records and styles together without introducing another framework or router dependency.

## Open locally

Run `npm run dev` and visit `/admin/login`, or use the public site's Admin sign in link.

Sign in with a real Supabase account. Create and confirm the user in Supabase Authentication, then add its UUID to `mybox_admins` using the instructions in `supabase/README.md`. Supabase manages persistent sessions, refresh and sign-out. Signed-in non-admin users see access denied. Membership verification errors fail closed and offer retry.

## Routes

- `/admin/login`: Supabase admin login
- `/admin`: overview and recent enquiries
- `/admin/bookings`: booking list, creation, editing, status updates and confirmed deletion
- `/admin/drivers`: driver enquiry search, viewing and editing
- `/admin/franchises`: franchise enquiry search, viewing and editing
- `/admin/settings`: workspace details and sign-out

Enquiries and bookings now load from Supabase. Enquiry edits, status changes, booking creation/editing and confirmed deletion persist in the database. Errors retain the form contents. Public forms write to the same enquiry table. The dashboard no longer imports demoData.ts. Row Level Security enforces permissions; the frontend access gate controls the interface.

Database operations live in `src/lib/services/`; schema types are in `src/types/database.ts`. `AdminAccess.tsx` restores sessions and checks membership. Refresh data reloads the workspace. Queries currently use Supabase's configured result limit; large datasets will need pagination and exact-count queries. Booking date/time represent the local service schedule.

Production hosting must serve `index.html` for `/admin` and its child paths so direct navigation and reload work with this single-page app.

## Validation

- `npm run typecheck`
- `npm run build`
- `npm test`

Tests mock the Supabase boundary and cover mapping, error handling, admin membership, sign-in errors, deletion failures and protection of booking metadata. No admin credentials were available, so authenticated hosted CRUD, live RLS with admin/non-admin users, session expiry and browser behaviour of the new login remain to be verified with your accounts. Before handover, submit a public enquiry, edit it as admin, create/edit/delete a test booking, reload, sign out and repeat access checks with a non-admin user.

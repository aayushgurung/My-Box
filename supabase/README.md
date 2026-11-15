# Supabase database setup

1. Open your Supabase project, then SQL Editor > New query.
2. Paste the entire contents of `supabase/setup.sql` and click Run. This single transaction creates the enquiry, booking and admin membership tables, or extends the existing enquiry table. It does not delete existing records. It replaces the policies named in the existing migration.
3. In Authentication > Users, create your admin user. Copy its user UUID.
4. Run this in SQL Editor, replacing the placeholder:

```sql
insert into public.mybox_admins (user_id)
values ('YOUR_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

5. Confirm the tables appear in Table Editor. Public enquiry submissions should now work with your configured URL and browser key.

## Tables

- `mybox_enquiries`: driver and franchise submissions, separated by `kind`; contact details, message, `details` JSON, review status and internal notes. Driver details use vehicle, availability and experience; franchise details use investment and experience.
- `mybox_bookings`: all fields in the admin booking form, plus a generated UUID, creator and creation timestamp. Date/time represent local service scheduling; no timezone conversion is performed.
- `mybox_admins`: explicit membership linked to Supabase Auth users. Only SQL Editor or trusted server access can grant membership.

Public visitors may insert new enquiries with no internal notes. Only allowlisted authenticated admins may read/change enquiries and manage bookings. Other signed-in users have no access to those existing records.

## Frontend mapping

Enquiry UI `name` maps to `full_name`; UI `date` comes from `created_at`; vehicle, availability, investment and experience come from `details`. Status and notes map directly. Booking fields map directly except generated metadata. IDs are database UUIDs rather than the demo DR/FR/BK identifiers.

The admin frontend now uses Supabase Auth, admin membership checks and CRUD queries. See `src/admin/README.md` for setup and verification. Public enquiry forms insert into the same enquiry table.

For migrations managed by Supabase CLI, apply the two files under `migrations/` in timestamp order instead of running the combined setup file. Do not treat setup.sql as an additional migration.

This SQL was reviewed against the source fields but has not been executed or validated against your hosted database in this session. Your browser anon/publishable key cannot run schema changes. Do not put database passwords, secret keys or service_role keys in VITE_ variables.

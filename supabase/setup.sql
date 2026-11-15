BEGIN;
/*
# Create MyBox enquiry submissions

1. New Tables
- `mybox_enquiries` stores driver recruitment and franchise enquiry submissions.
- `id` is the generated submission identifier.
- `kind` identifies `driver` or `franchise` submissions.
- `full_name`, `email`, `phone`, `city`, `message`, and `details` store the form responses.
- `created_at` records when a submission was received.

2. Security
- Row level security is enabled.
- Anonymous visitors may submit enquiries but cannot read them.
- Authenticated administrators may view, update, and delete enquiries.

3. Important Notes
- This table is intentionally single-tenant and does not associate submissions with customers or drivers.
- The public insert policy is limited to creating enquiry rows; admin review requires a signed-in Supabase account.
*/

CREATE TABLE IF NOT EXISTS public.mybox_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('driver', 'franchise')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  message text NOT NULL DEFAULT '',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mybox_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit MyBox enquiries" ON public.mybox_enquiries;
CREATE POLICY "Public can submit MyBox enquiries"
ON public.mybox_enquiries FOR INSERT
TO anon, authenticated
WITH CHECK (kind IN ('driver', 'franchise'));

DROP POLICY IF EXISTS "Admins can read MyBox enquiries" ON public.mybox_enquiries;
CREATE POLICY "Admins can read MyBox enquiries"
ON public.mybox_enquiries FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can update MyBox enquiries" ON public.mybox_enquiries;
CREATE POLICY "Admins can update MyBox enquiries"
ON public.mybox_enquiries FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete MyBox enquiries" ON public.mybox_enquiries;
CREATE POLICY "Admins can delete MyBox enquiries"
ON public.mybox_enquiries FOR DELETE
TO authenticated
USING (true);

CREATE INDEX IF NOT EXISTS mybox_enquiries_kind_created_at_idx
ON public.mybox_enquiries (kind, created_at DESC);

-- Apply after 20260902103328_create_mybox_enquiries.sql.
-- Admin membership is managed only through SQL Editor / trusted server access.
CREATE TABLE IF NOT EXISTS public.mybox_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mybox_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mybox_admins FROM anon, authenticated;
GRANT SELECT ON public.mybox_admins TO authenticated;
DROP POLICY IF EXISTS "Read own admin membership" ON public.mybox_admins;
CREATE POLICY "Read own admin membership" ON public.mybox_admins
FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

ALTER TABLE public.mybox_enquiries
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New'
    CHECK (status IN ('New', 'In review', 'Contacted', 'Approved', 'Closed')),
  ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '';

-- details JSON preserves the public form's vehicle, availability,
-- investment and experience fields without changing existing submissions.
DROP POLICY IF EXISTS "Public can submit MyBox enquiries" ON public.mybox_enquiries;
CREATE POLICY "Public can submit MyBox enquiries" ON public.mybox_enquiries
FOR INSERT TO anon, authenticated
WITH CHECK (kind IN ('driver', 'franchise') AND status = 'New' AND notes = '');

DROP POLICY IF EXISTS "Admins can read MyBox enquiries" ON public.mybox_enquiries;
DROP POLICY IF EXISTS "Admins can update MyBox enquiries" ON public.mybox_enquiries;
DROP POLICY IF EXISTS "Admins can delete MyBox enquiries" ON public.mybox_enquiries;
CREATE POLICY "Admins can read MyBox enquiries" ON public.mybox_enquiries
FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.mybox_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Admins can update MyBox enquiries" ON public.mybox_enquiries
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.mybox_admins WHERE user_id = (SELECT auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.mybox_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Admins can delete MyBox enquiries" ON public.mybox_enquiries
FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.mybox_admins WHERE user_id = (SELECT auth.uid())));
REVOKE ALL ON public.mybox_enquiries FROM anon, authenticated;
GRANT INSERT ON public.mybox_enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mybox_enquiries TO authenticated;

CREATE TABLE IF NOT EXISTS public.mybox_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer text NOT NULL CHECK (length(trim(customer)) > 0),
  email text NOT NULL,
  phone text NOT NULL,
  pickup text NOT NULL CHECK (length(trim(pickup)) > 0),
  destination text NOT NULL CHECK (length(trim(destination)) > 0),
  date date NOT NULL,
  time time NOT NULL,
  size text NOT NULL CHECK (size IN ('Small parcel', 'Medium parcel', 'Large parcel')),
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Scheduled'
    CHECK (status IN ('Scheduled', 'In transit', 'Delivered', 'Cancelled')),
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mybox_bookings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mybox_bookings FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mybox_bookings TO authenticated;
DROP POLICY IF EXISTS "Admins manage MyBox bookings" ON public.mybox_bookings;
CREATE POLICY "Admins manage MyBox bookings" ON public.mybox_bookings
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.mybox_admins WHERE user_id = (SELECT auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.mybox_admins WHERE user_id = (SELECT auth.uid())));
CREATE INDEX IF NOT EXISTS mybox_bookings_date_idx ON public.mybox_bookings (date, time);
CREATE INDEX IF NOT EXISTS mybox_enquiries_status_idx ON public.mybox_enquiries (status, created_at DESC);

COMMIT;

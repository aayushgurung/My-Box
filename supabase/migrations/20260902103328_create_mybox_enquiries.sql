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

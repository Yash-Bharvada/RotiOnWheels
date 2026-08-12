/*
# Create RotiOnWheels donations table

1. New Tables
- `roti_donations` stores donor details and mock payment records for the public donation flow.
- `id` unique donation identifier.
- `full_name`, `email`, `mobile`, and `pan_number` store donor-provided receipt details.
- `amount` stores the donation amount in Indian rupees.
- `rotis_sponsored` stores the impact equivalent shown to the donor.
- `payment_status` stores the mock gateway result.
- `created_at` stores the submission time.
2. Security
- Row level security is enabled.
- Public anon and authenticated CRUD policies support this no-login donation experience.
3. Important Notes
- This single-tenant table is intentionally shared for donation processing without a sign-in screen.
- PAN and contact information are used only for the provisional receipt experience.
*/

CREATE TABLE IF NOT EXISTS roti_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  pan_number text NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  rotis_sponsored integer NOT NULL CHECK (rotis_sponsored > 0),
  payment_status text NOT NULL DEFAULT 'success',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE roti_donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_roti_donations" ON roti_donations;
CREATE POLICY "public_select_roti_donations" ON roti_donations FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_roti_donations" ON roti_donations;
CREATE POLICY "public_insert_roti_donations" ON roti_donations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_roti_donations" ON roti_donations;
CREATE POLICY "public_update_roti_donations" ON roti_donations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_roti_donations" ON roti_donations;
CREATE POLICY "public_delete_roti_donations" ON roti_donations FOR DELETE TO anon, authenticated USING (true);

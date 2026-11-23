-- Ruta Pacifico — card payments at checkout (Powertranz / BAC Credomatic)
--
-- The Supabase project is SHARED with Can't Wait Travel (same `routes`
-- table). This file adds what Ruta Pacifico needs and is safe to run after,
-- before, or instead of cwt-web's
-- `supabase/migrations/20261106000000_create_powertranz_transactions.sql`:
-- every statement is idempotent.
--
-- Apply by hand in the Supabase SQL editor.

-- 1) Server-side copy of every Ruta Pacifico booking that goes through the
--    card step. Until now a booking only lived in the customer's browser
--    (sessionStorage) and in two emails; a charge needs a row the server
--    owns, with a total it computed itself from the `routes` table.
CREATE TABLE IF NOT EXISTS rp_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  confirmation_code TEXT NOT NULL,            -- "RP-XXXXXX", shown to the customer
  locale TEXT CHECK (locale IN ('en', 'es')),

  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,

  trips JSONB NOT NULL,                       -- TripItem[] with SERVER prices
  total_amount NUMERIC(10, 2) NOT NULL,       -- recomputed from `routes`; what we charge
  client_total NUMERIC(10, 2),                -- what the browser displayed (audit only)
  currency TEXT DEFAULT 'USD' NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment', 'confirmed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'processing', 'approved', 'failed')),

  payment_provider TEXT,                      -- 'powertranz'
  payment_transaction_id TEXT,
  payment_auth_code TEXT,
  payment_rrn TEXT,
  payment_card_brand TEXT,
  paid_at TIMESTAMPTZ,

  pending_emails_sent_at TIMESTAMPTZ,         -- "payment link coming" pair
  paid_emails_sent_at TIMESTAMPTZ,            -- "paid & confirmed" pair

  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_rp_bookings_code ON rp_bookings (confirmation_code);
CREATE INDEX IF NOT EXISTS idx_rp_bookings_created_at ON rp_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rp_bookings_status ON rp_bookings (status, payment_status);

ALTER TABLE rp_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rp_bookings_deny_all" ON rp_bookings;
CREATE POLICY "rp_bookings_deny_all" ON rp_bookings
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- 2) Powertranz attempts. Same table both sites write to; `site` tells them
--    apart. Identical to the cwt-web migration plus the `site` column.
CREATE TABLE IF NOT EXISTS powertranz_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  booking_number TEXT NOT NULL,
  booking_type TEXT CHECK (booking_type IN ('shuttle', 'tour')),
  order_id UUID,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  tx_type TEXT NOT NULL DEFAULT 'sale' CHECK (tx_type IN ('sale', 'auth', 'capture', 'void', 'refund')),
  environment TEXT NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'staging')),
  status TEXT NOT NULL DEFAULT 'initiated'
    CHECK (status IN ('initiated', 'authenticating', 'approved', 'declined', 'error', 'abandoned')),
  transaction_identifier UUID NOT NULL UNIQUE,
  order_identifier TEXT NOT NULL,
  spi_token TEXT,
  iso_response_code TEXT,
  response_message TEXT,
  authorization_code TEXT,
  rrn TEXT,
  card_brand TEXT,
  pan_token TEXT,
  three_ds_eci TEXT,
  three_ds_authentication_status TEXT,
  three_ds_protocol_version TEXT,
  three_ds_cavv TEXT,
  three_ds_ds_trans_id TEXT,
  customer_email TEXT,
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_phone TEXT,
  customer_country TEXT,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  request_payload JSONB,
  response_payload JSONB,
  callback_payload JSONB,
  payment_payload JSONB
);

ALTER TABLE powertranz_transactions
  ADD COLUMN IF NOT EXISTS site TEXT NOT NULL DEFAULT 'cwt' CHECK (site IN ('cwt', 'ruta'));

CREATE INDEX IF NOT EXISTS idx_powertranz_tx_booking_number ON powertranz_transactions (booking_number);
CREATE INDEX IF NOT EXISTS idx_powertranz_tx_created_at ON powertranz_transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_powertranz_tx_status ON powertranz_transactions (status);
CREATE INDEX IF NOT EXISTS idx_powertranz_tx_site ON powertranz_transactions (site);

ALTER TABLE powertranz_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "powertranz_transactions_deny_all" ON powertranz_transactions;
CREATE POLICY "powertranz_transactions_deny_all" ON powertranz_transactions
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
